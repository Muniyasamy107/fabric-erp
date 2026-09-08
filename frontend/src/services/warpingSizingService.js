import API from './api';

export const getAllBeams = () => API.get('/beams');
export const createBeamJob = (data) => API.post('/beams/create', data);
export const mountBeamOnLoom = (id, loomNumber) =>
  API.put(`/beams/${id}/mount-on-loom?loomNumber=${encodeURIComponent(loomNumber)}`);
export const updateBeamStatus = (id, status) =>
  API.put(`/beams/${id}/status?status=${status}`);