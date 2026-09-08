import API from './api';

export const getQualityReports = () => API.get('/quality/reports');
export const getQualityReportById = (id) => API.get(`/quality/reports/${id}`);
export const submitQualityInspection = (data) => API.post('/quality/inspect', data);