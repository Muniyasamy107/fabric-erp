import API from './api';

export const getGatePasses = () => API.get('/gate-pass');
export const issueGatePass = (data) => API.post('/gate-pass', data);
export const updateGateStatus = (id, status) =>
  API.put(`/gate-pass/${id}/status?status=${status}`);