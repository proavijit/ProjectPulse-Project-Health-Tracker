import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

// Auth API
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    getCurrentUser: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// Projects API
export const projectsApi = {
    getAll: () => api.get('/projects'),
    getById: (id: string) => api.get(`/projects/${id}`),
    create: (data: any) => api.post('/projects', data),
    update: (id: string, data: any) => api.put(`/projects/${id}`, data),
    delete: (id: string) => api.delete(`/projects/${id}`),
};

// Check-ins API
export const checkinsApi = {
    create: (data: any) => api.post('/checkins', data),
    getByProject: (projectId: string) => api.get(`/checkins/project/${projectId}`),
    getPending: () => api.get('/checkins/pending'),
};

// Feedback API
export const feedbackApi = {
    create: (data: any) => api.post('/feedback', data),
    getByProject: (projectId: string) => api.get(`/feedback/project/${projectId}`),
    getPending: () => api.get('/feedback/pending'),
};

// Risks API
export const risksApi = {
    getAll: () => api.get('/risks'),
    create: (data: any) => api.post('/risks', data),
    getByProject: (projectId: string) => api.get(`/risks/project/${projectId}`),
    update: (id: string, data: any) => api.put(`/risks/${id}`, data),
    getHighPriority: () => api.get('/risks/high-priority'),
};

// Dashboard API
export const dashboardApi = {
    getAdmin: () => api.get('/dashboard/admin'),
    getEmployee: () => api.get('/dashboard/employee'),
    getClient: () => api.get('/dashboard/client'),
};

// Activities API
export const activitiesApi = {
    getByProject: (projectId: string, limit = 50) =>
        api.get(`/activities/project/${projectId}?limit=${limit}`),
};

export default api;
