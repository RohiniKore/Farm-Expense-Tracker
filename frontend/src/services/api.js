// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

// Expenses
export const getExpenses = (month, year) => api.get('/expenses', { params: { month, year } });
export const getExpensesSummary = () => api.get('/expenses/summary');
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Yields
export const getYields = (month, year) => api.get('/yields', { params: { month, year } });
export const getYieldsSummary = () => api.get('/yields/summary');
export const createYield = (data) => api.post('/yields', data);
export const updateYield = (id, data) => api.put(`/yields/${id}`, data);
export const deleteYield = (id) => api.delete(`/yields/${id}`);

// Chatbot
export const sendChatMessage = (message) => api.post('/chatbot/chat', { message });

export default api;