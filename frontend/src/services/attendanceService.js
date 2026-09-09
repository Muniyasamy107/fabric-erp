import API from './api';

export const getAttendanceLogs = () =>
  API.get('/attendance/logs').catch(() => ({ data: [] }));

export const getAttendanceByDate = (date) =>
  API.get(`/attendance/date/${encodeURIComponent(date)}`).catch(() => ({ data: [] }));

export const saveBulkAttendance = (recordsList) =>
  API.post('/attendance/bulk-punch', recordsList);

export const punchWorkerAttendance = (data) =>
  API.post('/attendance/punch', data);

export const punchWorkerOut = (data) =>
  API.put('/attendance/punch-out', data);

export const getWorkerByBadge = (badge) =>
  API.get(`/workers/badge/${encodeURIComponent(badge)}`);

export const scanKioskBadge = (badge) =>
  API.get(`/attendance/badge/${encodeURIComponent(badge)}`);

export const getWorkers = () =>
  API.get('/workers').catch(() => ({ data: [] }));

export const getWorkersByDept = (dept) =>
  API.get(`/workers/department/${encodeURIComponent(dept)}`).catch(() => ({ data: [] }));

export const registerWorker = (data) =>
  API.post('/workers', data);

export const deleteWorker = (id) =>
  API.delete(`/workers/${id}`);