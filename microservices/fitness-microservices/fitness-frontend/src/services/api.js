import axios from "axios";

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (userId) {
        config.headers['X-User-ID'] = userId;
    }

    return config;
});

export const getActivities = () => api.get('/activities');

export const getActivityById = (id) => api.get(`/activities/${id}`);

export const addActivity = (activity) => api.post('/activities', activity);

export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);

export const createProfile = (data) => api.post('/users/profile', data);

export const getProfile = () => api.get('/users/profile/me');

export const updateProfile = (data) => api.put('/users/profile', data);

export const logoutUser = () => {
    // Clear the token from localStorage to prevent future requests
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    return Promise.resolve();
};

export const claimLoginReward = () => api.post('/users/profile/claim-login-reward', {});

export const claimGoalReward = () => api.post('/users/profile/claim-goal-reward', {});