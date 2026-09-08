import API from './api';

export const getYarnStock = () => API.get('/dye-house/yarn-stock');
export const receiveYarnStock = (data) => API.post('/dye-house/yarn-stock', data);
export const getDyeRecipes = () => API.get('/dye-house/recipes');
export const createDyeRecipe = (data) => API.post('/dye-house/recipes', data);
export const updateLabDipStatus = (id, status) =>
  API.put(`/dye-house/recipes/${id}/status?status=${status}`);