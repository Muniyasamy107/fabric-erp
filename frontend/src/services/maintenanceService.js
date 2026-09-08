import API from './api';

export const getMaintenanceTickets = () => API.get('/maintenance/tickets');
export const logBreakdownTicket = (data) => API.post('/maintenance/tickets', data);
export const resolveMaintenanceTicket = (id, downtimeHours, partsUsed, resolutionNotes) =>
  API.put(`/maintenance/tickets/${id}/resolve?downtimeHours=${downtimeHours}&partsUsed=${encodeURIComponent(partsUsed || '')}&resolutionNotes=${encodeURIComponent(resolutionNotes || '')}`);

export const getSpareParts = () => API.get('/maintenance/spares');
export const addSparePart = (data) => API.post('/maintenance/spares', data);