import API from './api';

export const getUsers = () => API.get('/users');
export const createUser = (data) => API.post('/users', data);
export const toggleUser = (id) => API.put(`/users/${id}/toggle`);
export const resetUserPassword = (id) => API.put(`/users/${id}/reset-password`);