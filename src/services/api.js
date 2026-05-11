import axios from 'axios';
import toast from 'react-hot-toast';

// ✅ Use your backend IP address
const API_URL = process.env.REACT_APP_API_URL || 'http://18.132.200.126:5001/api';
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_CANCELED') return Promise.reject(error);
    
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (message && message !== 'Route not found') {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// ======================
// AUTH API
// ======================
export const register = (data) => {
  return api.post('/auth/register', {
    name: data.name || '',
    email: data.email || '',
    password: data.password || '',
    phone: data.phone || '',
    address: data.address || '',
    city: data.city || '',
    province: data.province || '',
    postal_code: data.postal_code || ''
  });
};

export const login = (data) => {
  return api.post('/auth/login', {
    email: data.email || '',
    password: data.password || ''
  });
};

export const getMe = () => api.get('/auth/me');

// ======================
// PRODUCTS
// ======================
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getProductStats = () => api.get('/products/stats');

// ======================
// ORDERS
// ======================
export const createOrder = (data) => api.post('/orders', data);
export const getOrders = (params) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const getOrderStats = () => api.get('/orders/stats');
export const getPaymentStatus = (orderNumber) => api.get(`/orders/payment-status/${orderNumber}`);

// ======================
// USER
// ======================
export const updateProfile = (data) => api.put('/users/profile', data);
export const getUserOrders = () => api.get('/users/orders');

// ======================
// PAYFAST
// ======================
export const initiatePayFastPayment = (orderId) => api.post('/payfast/initiate', { orderId });

// ======================
// CONTACT
// ======================
export const sendContactMessage = (data) => api.post('/contact', data);
export const getContactMessages = () => api.get('/contact');

export default api;