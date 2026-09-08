import API from './api';

export const getExportContracts = () => API.get('/exports/contracts');
export const createExportContract = (data) => API.post('/exports/contracts', data);
export const updateContractStatus = (id, status) =>
  API.put(`/exports/contracts/${id}/status?status=${status}`);