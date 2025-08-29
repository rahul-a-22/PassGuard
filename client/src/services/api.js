import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set up axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Password API services
export const passwordService = {
  // Get all passwords
  getAll: async () => {
    try {
      const response = await api.get('/passwords');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get password by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/passwords/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new password
  create: async (passwordData) => {
    try {
      const response = await api.post('/passwords', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update password
  update: async (id, passwordData) => {
    try {
      const response = await api.put(`/passwords/${id}`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete password
  delete: async (id) => {
    try {
      const response = await api.delete(`/passwords/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default api;