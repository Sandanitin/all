// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id) => `/api/users/${id}`,
    STATUS: (id) => `/api/users/${id}/status`,
  },
  PRODUCTS: {
    BASE: '/api/products',
    BY_ID: (id) => `/api/products/${id}`,
  },
  ORDERS: {
    BASE: '/api/orders',
    BY_ID: (id) => `/api/orders/${id}`,
    STATUS: (id) => `/api/orders/${id}/status`,
  },
  SUBSCRIPTIONS: {
    BASE: '/api/subscriptions',
    BY_ID: (id) => `/api/subscriptions/${id}`,
    STATUS: (id) => `/api/subscriptions/${id}/status`,
    CANCEL: (id) => `/api/subscriptions/${id}/cancel`,
    PAUSE: (id) => `/api/subscriptions/${id}/pause`,
    RESUME: (id) => `/api/subscriptions/${id}/resume`,
  },
};
