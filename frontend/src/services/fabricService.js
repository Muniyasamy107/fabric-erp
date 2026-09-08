import API from './api';

export const getFabrics = () => API.get('/fabrics');
export const getRemnantFabrics = () => API.get('/fabrics/remnants');
export const getFabric = (id) => API.get(`/fabrics/${id}`);
export const getFabricBySku = (itemCode) => API.get(`/fabrics/sku/${encodeURIComponent(itemCode)}`);
export const createFabric = (fabricData) => API.post('/fabrics', fabricData);
export const updateFabric = (id, fabricData) => API.put(`/fabrics/${id}`, fabricData);
export const toggleRemnantClearance = (id, discountPct) =>
  API.put(`/fabrics/${id}/toggle-remnant?discountPct=${discountPct}`);
export const deleteFabric = (id) => API.delete(`/fabrics/${id}`);