import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Confession APIs
export const fetchConfessions = (sort = 'latest') =>
  API.get(`/confessions?sort=${sort}`);

export const createConfession = (data) =>
  API.post('/confessions', data);

export const updateConfession = (id, data) =>
  API.put(`/confessions/${id}`, data);

export const deleteConfession = (id, secretCode) =>
  API.delete(`/confessions/${id}`, { data: { secretCode } });

export const addReaction = (id, type) =>
  API.post(`/confessions/${id}/react`, { type });

// Reply APIs
export const fetchReplies = (confessionId) =>
  API.get(`/confessions/${confessionId}/replies`);

export const createReply = (confessionId, data) =>
  API.post(`/confessions/${confessionId}/reply`, data);

// Auth APIs
export const fetchCurrentUser = () =>
  axios.get('/auth/me', { withCredentials: true });

export const logoutUser = () =>
  axios.get('/auth/logout', { withCredentials: true });

export default API;
