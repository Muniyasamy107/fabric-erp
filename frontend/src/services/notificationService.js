import API from './api';

export const getUnreadNotifications = () => API.get('/notifications/unread');
export const getAllNotifications = () => API.get('/notifications/all');
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put('/notifications/read-all');