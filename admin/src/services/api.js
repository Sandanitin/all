import axios from 'axios';
import { API_CONFIG } from '../config/api.js';

const API_URL = API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Log API configuration
console.log('API Base URL:', API_URL);

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const adminApi = {
  // Auth
  auth: {
    register: (userData) => api.post('/api/auth/register', userData),
    login: (credentials) => api.post('/api/auth/login', credentials),
    logout: () => api.post('/api/auth/logout'),
    getProfile: () => api.get('/api/auth/profile'),
    forgotPassword: (data) => api.post('/api/auth/forgot-password', { email: data.email }),
    verifyOTP: (data) => api.post('/api/auth/verify-otp', { email: data.email, otp: data.otp }),
    resetPassword: (data) => api.post('/api/auth/reset-password', {
      email: data.email,
      otp: data.code,
      newPassword: data.newPassword
    })
  },

  // Users
  users: {
    getAll: () => api.get('/api/users'),
    getById: (id) => api.get(`/api/users/${id}`),
    create: (data) => api.post('/api/users', data),
    update: (id, data) => api.put(`/api/users/${id}`, data),
    updateStatus: (id, isActive) => api.put(`/api/users/${id}/status`, { isActive }),
    delete: (id) => api.delete(`/api/users/${id}`)
  },

  // Products
  products: {
    getAll: () => api.get('/api/products'),
    getById: (id) => api.get(`/api/products/${id}`),
    create: (formData) => {
      const token = localStorage.getItem('adminToken');
      return api.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
    },
    update: (id, formData) => {
      const token = localStorage.getItem('adminToken');
      return api.put(`/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
    },
    delete: (id) => api.delete(`/api/products/${id}`),
  },

  // Orders
  orders: {
    getAll: () => api.get('/api/orders'),
    getById: (id) => api.get(`/api/orders/${id}`),
    updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
  },

  

};

export default adminApi; 