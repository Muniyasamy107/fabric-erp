import API from './api';

export const getShiftOeeLogs = () => API.get('/shift-oee/logs');
export const logShiftProduction = (data) => API.post('/shift-oee/log-shift', data);