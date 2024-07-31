# MERN Stack Coding Challenge

## Overview
This project is a MERN (MongoDB, Express, React, Node.js) application designed to manage product transactions using data fetched from a third-party API. It provides a comprehensive set of APIs for data initialization, transaction listing, statistics, and visualizations.

## Data Source
- **Third Party API URL**: [Product Transactions API](https://s3.amazonaws.com/roxiler.com/product_transaction.json)
- **Request Method**: GET
- **Response Format**: JSON

## Backend Features
- **Database Initialization**: An API to fetch JSON data from the third-party API and initialize the database with seed data.
- **Transaction Listing**: 
  - API to list all transactions with support for search and pagination.
  - Search parameters match against product title, description, and price.
  - Default pagination values: page = 1, per page = 10.
- **Statistics API**: 
  - Total sale amount for a selected month.
  - Total number of sold items for a selected month.
  - Total number of unsold items for a selected month.
- **Bar Chart API**: 
  - Returns price ranges and the number of items in those ranges for the selected month.
- **Pie Chart API**: 
  - Returns unique categories and the number of items in each category for the selected month.
- **Combined API**: 
  - Fetches data from all previous APIs and returns a combined JSON response.

## Frontend Features
- **Transaction Table**:
  - Displays transactions based on the selected month (default: March).
  - Includes a search box to filter transactions by title, description, or price.
  - Supports pagination with "Next" and "Previous" buttons.
- **Statistics Display**:
  - Shows total sales, total sold items, and total not sold items for the selected month.
- **Bar Chart Visualization**:
  - Displays a bar chart of price ranges and item counts for the selected month.
- **Responsive Design**:
  - The application is designed to be user-friendly and visually appealing, following the provided mockups.

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AJ-Mern.git

2. Navigate to the project directory:
   ```bash
    bash
   cd AJ-Mern

3. Install dependencies for both backend and frontend:
    ```bash
      cd backend
      npm install
      cd ../frontend
      npm install

4. Start the backend server:
   ````bash
      cd ../backend
      node server.js ("run your .js file in my case my file name is server.js")
 
5. Start the frontend application:
   ````bash
    cd ../frontend
    npm start
   
