import API from './api';

export const getStockMovements = () => API.get('/stock-movements');
export const getFabricMovements = (fabricId) => API.get(`/stock-movements/fabric/${fabricId}`);
export const recordWastage = (data) => API.post('/stock-movements/record-wastage', data);