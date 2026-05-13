import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log('--- API CONFIGURATION ---');
console.log('Target BASE_URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log(`Sending ${config.method?.toUpperCase()} to: ${config.url}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log(`Success [${response.status}] from: ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    console.error(`API Error [${status || 'NETWORK'}]:`, message);
    
    if (status === 401) {
      console.warn("Session expired. Clearing local data...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const signupAPI = (data) => api.post('/api/auth/signup', data);
export const loginAPI  = (data) => api.post('/api/auth/login', data);
export const getMeAPI  = () => api.get('/api/auth/me');

export const getProfileAPI    = () => api.get('/api/user/profile');
export const updateProfileAPI = (data) => api.put('/api/user/profile', data);

export const getAllUsersAPI    = () => api.get('/api/admin/users');
export const deleteUserAPI     = (id) => api.delete(`/api/admin/users/${id}`);
export const updateUserRoleAPI = (id, role) => api.put(`/api/admin/users/${id}/role`, { role });

export const fetchImagesAPI = () => api.get('/api/images');
export const uploadImageAPI = (formData) => api.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' } 
});

export default api;