import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  lineLogin: (accessToken) => api.post('/auth/line-login', { accessToken }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  addPaymentMethod: (paymentData) => api.post('/auth/payment-method', paymentData),
};

// Groups API functions
export const groupsAPI = {
  createGroup: (groupData) => api.post('/groups/create', groupData),
  joinGroup: (groupCode) => api.post('/groups/join', { groupCode }),
  getMyGroups: () => api.get('/groups/my-groups'),
  getGroupDetails: (groupId) => api.get(`/groups/${groupId}`),
  leaveGroup: (groupId) => api.post(`/groups/${groupId}/leave`),
  updateMemberRole: (groupId, memberId, role) => 
    api.put(`/groups/${groupId}/members/${memberId}/role`, { role }),
};

export default api;