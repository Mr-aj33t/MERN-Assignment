// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI
const uri = "mongodb+srv://AJ:DEVIL@atlascluster.1ewklok.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";
// Use Mongoose to connect to the MongoDB cluster
mongoose.connect(uri)
    .then(() => console.log('Mongoose connected to MongoDB'))
    .catch(err => console.log('Mongoose connection error:', err));

// Middleware
app.use(express.json());

// Define the schema for transactions
const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    dateOfSale: {
        type: Date,
        required: true
    },
    sold: {
        type: Boolean,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

// Create the model
const Transaction = mongoose.model('Transaction', transactionSchema);

// API to initialize the database
app.get('/initialize', async(req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany({}); // Clear existing data
        await Transaction.insertMany(transactions); // Seed new data

        res.status(200).send('Database initialized with seed data.');
    } catch (error) {
        res.status(500).send('Error initializing database: ' + error.message);
    }
});

// API to list all transactions with search and pagination
app.get('/transactions', async(req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;

    // Build the query object
    const query = {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ]
    };

    // Check if the search term is a number and add it to the query
    const priceValue = parseFloat(search);
    if (!isNaN(priceValue)) {
        query.$or.push({ price: priceValue });
    }

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        const total = await Transaction.countDocuments(query);

        res.status(200).json({ transactions, total });
    } catch (error) {
        res.status(500).send('Error fetching transactions: ' + error.message);
    }
});

// API for statistics
app.get('/statistics/:month', async(req, res) => {
    const month = req.params.month.toLowerCase();
    const monthMap = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11
    };

    if (!monthMap.hasOwnProperty(month)) {
        return res.status(400).send('Invalid month provided.');
    }

    const startDate = new Date(new Date().getFullYear(), monthMap[month], 1);
    const endDate = new Date(new Date().getFullYear(), monthMap[month] + 1, 0);

    try {
        const totalSales = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate }, sold: true } },
            { $group: { _id: null, total: { $sum: '$price' }, count: { $sum: 1 } } }
        ]);

        const totalNotSold = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: false });

        res.status(200).json({
            totalSaleAmount: totalSales[0] ? totalSales[0].total || 0 : 0,
            totalSoldItems: totalSales[0] ? totalSales[0].count || 0 : 0,
            totalNotSoldItems: totalNotSold
        });
    } catch (error) {
        res.status(500).send('Error fetching statistics: ' + error.message);
    }
});

// API for bar chart data
app.get('/bar-chart/:month', async(req, res) => {
    const month = req.params.month.toLowerCase();
    const monthMap = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11
    };

    if (!monthMap.hasOwnProperty(month)) {
        return res.status(400).send('Invalid month provided.');
    }

    const startDate = new Date(new Date().getFullYear(), monthMap[month], 1);
    const endDate = new Date(new Date().getFullYear(), monthMap[month] + 1, 0);

    try {
        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity }
        ];

        const results = await Promise.all(priceRanges.map(async(range) => {
            const count = await Transaction.countDocuments({
                price: { $gte: range.min, $lte: range.max },
                dateOfSale: { $gte: startDate, $lte: endDate }
            });
            return { range: `${range.min}-${range.max}`, count };
        }));

        res.status(200).json(results);
    } catch (error) {
        res.status(500).send('Error fetching bar chart data: ' + error.message);
    }
});

// API for pie chart data
app.get('/pie-chart/:month', async(req, res) => {
    const month = req.params.month.toLowerCase();
    const monthMap = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11
    };

    if (!monthMap.hasOwnProperty(month)) {
        return res.status(400).send('Invalid month provided.');
    }

    const startDate = new Date(new Date().getFullYear(), monthMap[month], 1);
    const endDate = new Date(new Date().getFullYear(), monthMap[month] + 1, 0);

    try {
        const categories = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const result = categories.map(cat => ({ category: cat._id, items: cat.count }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).send('Error fetching pie chart data: ' + error.message);
    }
});


// Combined API
app.get('/combined/:month', async(req, res) => {
    const month = req.params.month.toLowerCase();
    const monthMap = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11
    };

    if (!monthMap.hasOwnProperty(month)) {
        return res.status(400).send('Invalid month provided.');
    }

    const startDate = new Date(new Date().getFullYear(), monthMap[month], 1);
    const endDate = new Date(new Date().getFullYear(), monthMap[month] + 1, 0);

    // Define price ranges for the bar chart
    const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: Infinity }
    ];

    try {
        const [totalSales, barChartData, pieChartData] = await Promise.all([
            Transaction.aggregate([
                { $match: { dateOfSale: { $gte: startDate, $lte: endDate }, sold: true } },
                { $group: { _id: null, total: { $sum: '$price' }, count: { $sum: 1 } } }
            ]),
            // Bar chart data
            Promise.all(priceRanges.map(async(range) => {
                const count = await Transaction.countDocuments({
                    price: { $gte: range.min, $lte: range.max },
                    dateOfSale: { $gte: startDate, $lte: endDate }
                });
                return { range: `${range.min}-${range.max}`, count };
            })),
            // Pie chart data
            Transaction.aggregate([
                { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ])
        ]);

        const totalNotSold = await Transaction.countDocuments({ dateOfSale: { $gte: startDate, $lte: endDate }, sold: false });

        res.status(200).json({
            totalSaleAmount: totalSales[0] ? totalSales[0].total || 0 : 0,
            totalSoldItems: totalSales[0] ? totalSales[0].count || 0 : 0,
            totalNotSoldItems: totalNotSold,
            barChart: barChartData,
            pieChart: pieChartData.map(cat => ({ category: cat._id, items: cat.count }))
        });
    } catch (error) {
        res.status(500).send('Error fetching combined data: ' + error.message);
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});