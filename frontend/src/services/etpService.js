import API from './api';

export const getEtpLogs = () => API.get('/etp/logs');
export const createEtpLog = (data) => API.post('/etp/logs', data);