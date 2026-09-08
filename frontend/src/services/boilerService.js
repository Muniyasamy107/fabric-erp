import API from './api';

export const getBoilerLogs = () => API.get('/boiler/logs');
export const createBoilerLog = (data) => API.post('/boiler/logs', data);