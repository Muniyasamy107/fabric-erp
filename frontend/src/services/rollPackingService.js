import API from './api';

export const getAllPackedRolls = () => API.get('/roll-packing/rolls');
export const getRollsByLot = (lotNo) => API.get(`/roll-packing/rolls/lot/${encodeURIComponent(lotNo)}`);
export const getRollsByBale = (baleNo) => API.get(`/roll-packing/rolls/bale/${encodeURIComponent(baleNo)}`);
export const packNewRoll = (data) => API.post('/roll-packing/pack-roll', data);
export const updateRollStatus = (id, status) => API.put(`/roll-packing/rolls/${id}/status?status=${status}`);