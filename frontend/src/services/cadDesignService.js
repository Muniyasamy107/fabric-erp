import API from './api';

export const getCadDesigns = () => API.get('/cad-designs');
export const createCadDesign = (data) => API.post('/cad-designs/create', data);
export const updateSampleStatus = (id, status, producedMeters, buyerComments, courierAwb) =>
  API.put(`/cad-designs/${id}/status?status=${status}&producedMeters=${producedMeters || ''}&buyerComments=${encodeURIComponent(buyerComments || '')}&courierAwb=${encodeURIComponent(courierAwb || '')}`);