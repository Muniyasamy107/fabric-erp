import API from './api';

export const getFinishingBatches = () => API.get('/finishing/batches');
export const createFinishingBatch = (data) => API.post('/finishing/batches', data);
export const updateFinishingStatus = (id, status, outputMeters) =>
  API.put(`/finishing/batches/${id}/status?status=${status}&outputMeters=${outputMeters || ''}`);