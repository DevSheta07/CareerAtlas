import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const signupUser = (data) => API.post('/auth/signup', data);
export const getMe = () => API.get('/auth/me');
export const getPendingUsers = () => API.get('/auth/pending-users');
export const approveUser = (id) => API.put(`/auth/approve-user/${id}`);
export const rejectUser = (id) => API.delete(`/auth/reject-user/${id}`);
export const getApprovedStudents = () => API.get('/auth/approved-students');
export const adminResetPassword = (id, password) => API.put(`/auth/reset-password/${id}`, { password });
export const deleteUser = (id) => API.delete(`/auth/delete-user/${id}`);

// Students
export const getStudents = (params) => API.get('/students', { params });
export const getStudent = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const getMyProfile = () => API.get('/students/profile/me');
export const updateMyProfile = (data) => API.put('/students/profile/me', data);

// Placements
export const getPlacements = (params) => API.get('/placements', { params });
export const createPlacement = (data) => API.post('/placements', data);
export const updatePlacement = (id, data) => API.put(`/placements/${id}`, data);
export const deletePlacement = (id) => API.delete(`/placements/${id}`);

// Higher Studies
export const getHigherStudies = (params) => API.get('/higher-studies', { params });
export const createHigherStudy = (data) => API.post('/higher-studies', data);
export const updateHigherStudy = (id, data) => API.put(`/higher-studies/${id}`, data);
export const deleteHigherStudy = (id) => API.delete(`/higher-studies/${id}`);

// Drives
export const getDrives = (params) => API.get('/drives', { params });
export const createDrive = (data) => API.post('/drives', data);
export const updateDrive = (id, data) => API.put(`/drives/${id}`, data);
export const deleteDrive = (id) => API.delete(`/drives/${id}`);

// Dashboard
export const getStats = () => API.get('/dashboard/stats');
export const getCompanyStats = () => API.get('/dashboard/company-stats');
export const getBranchStats = () => API.get('/dashboard/branch-stats');



