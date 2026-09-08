import API from './api';

export const loginApi = (username, password) =>
  API.post('/auth/login', { username, password });