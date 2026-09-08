import API from './api';

export const getCostSheets = () => API.get('/costing/sheets');
export const calculateCostSheet = (data) => API.post('/costing/calculate', data);