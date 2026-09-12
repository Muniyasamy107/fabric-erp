import API from './api';

export const loginApi = (username, password) =>
  API.post('/auth/login', { username, password });

export const registerApi = (fullName, username, password) =>
  API.post('/auth/register', { fullName, username, password });
