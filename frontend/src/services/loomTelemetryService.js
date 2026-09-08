import API from './api';

export const getLoomFloorMatrix = () => API.get('/telemetry/floor-matrix');
export const updateLoomLiveStatus = (loomNumber, status, alertMessage) =>
  API.put(`/telemetry/loom/${encodeURIComponent(loomNumber)}/status?status=${status}&alertMessage=${encodeURIComponent(alertMessage || '')}`);