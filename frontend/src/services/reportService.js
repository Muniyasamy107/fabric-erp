import API from './api';

export const getFinancialSummary = () => API.get('/reports/financial-summary');