import API from './api';

// Live drawer summary for today (channel-wise sales, bills, meters sold)
export const getTodayLiveSummary = () => API.get('/shifts/today');

// Close the day's shift register and generate the official Z-Report
export const closeShiftRegister = (payload) => API.post('/shifts/close', payload);

// Past closed shift Z-Report history
export const getShiftHistory = () => API.get('/shifts/history');
