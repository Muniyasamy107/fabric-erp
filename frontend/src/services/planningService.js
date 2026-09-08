import API from './api';

export const getProductionPlans = () => API.get('/planning/plans');
export const createProductionPlan = (data) => API.post('/planning/create-plan', data);
export const updatePlanStage = (id, stage) =>
  API.put(`/planning/plans/${id}/stage?stage=${stage}`);