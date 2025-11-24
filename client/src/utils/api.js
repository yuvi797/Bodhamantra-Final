import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  registerStudent: (data) => api.post('/auth/student/register', data),
  registerMentor: (data) => api.post('/auth/mentor/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Mentor APIs
export const mentorAPI = {
  getApprovedMentors: () => api.get('/mentors'),
  getMentorProfile: (mentorId) => api.get(`/mentors/${mentorId}`),
  getMyProfile: () => api.get('/mentors/me/profile'),
  updateAvailability: (data) => api.put('/mentors/me/availability', data),
  updateProfile: (data) => api.put('/mentors/me/profile', data),
};

// Request APIs
export const requestAPI = {
  createRequest: (data) => api.post('/requests', data),
  getMyRequests: () => api.get('/requests/me'),
  getMentorRequests: () => api.get('/requests/mentor/me'),
  updateRequestStatus: (requestId, status) =>
    api.patch(`/requests/${requestId}/status`, { status }),
  completeAndReview: (requestId, data) =>
    api.post(`/requests/${requestId}/complete`, data),
};


export default api;
