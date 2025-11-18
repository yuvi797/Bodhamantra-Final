import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL
// const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
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

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Admin Auth APIs
export const adminLogin = (credentials) => api.post('/admin/login', credentials);

// Admin Dashboard APIs
export const getAllUsers = () => api.get('/admin/students');
export const getAllMentors = (status) => api.get(`/admin/mentors?status=${status || ''}`);
export const approveMentor = (mentorId) => api.put(`/admin/mentors/${mentorId}/approve`);
export const rejectMentor = (mentorId) => api.put(`/admin/mentors/${mentorId}/reject`);
export const getAllRequests = () => api.get('/admin/requests');
export const getStats = () => api.get('/admin/stats');

export default api;
