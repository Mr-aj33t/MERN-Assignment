import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Ensure this matches your backend URL

export const fetchTransactions = (month, page = 1, search = '') => {
    return axios.get(`${API_URL}/transactions`, {
        params: { month, page, search },
    });
};

export const fetchStatistics = (month) => {
    return axios.get(`${API_URL}/statistics`, { params: { month } });
};

export const fetchBarChart = (month) => {
    return axios.get(`${API_URL}/bar-chart`, { params: { month } });
};

export const fetchPieChart = (month) => {
    return axios.get(`${API_URL}/pie-chart`, { params: { month } });
};