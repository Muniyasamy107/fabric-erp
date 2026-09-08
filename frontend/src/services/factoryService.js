import API from './api';

// B2B Wholesale Clients API
export const getWholesaleClients = () => API.get('/clients');
export const searchClientByPhone = (phone) => API.get('/clients/search', { params: { phone } });
export const registerWholesaleClient = (data) => API.post('/clients', data);

// Weaving Loom hall & active weaving batches API
export const getWeavingLooms = () => API.get('/production/looms');
export const saveWeavingLoom = (data) => API.post('/production/looms', data);
export const getProductionJobs = () => API.get('/production/jobs');
export const scheduleProductionJob = (data) => API.post('/production/jobs', data);
export const updateProductionProgress = (id, params) => API.put(`/production/jobs/${id}/status`, null, { params });

// Weaver piece-rate wage calculation API
export const getWeaverWages = () => API.get('/weaver-wages');
export const logWeaverWage = (data) => API.post('/weaver-wages/log', data);
export const payWeaverWage = (id, paymentMethod) => API.put(`/weaver-wages/${id}/pay?paymentMethod=${paymentMethod}`);

// B2B wholesale shipping dispatches API
export const getDispatchInvoices = () => API.get('/dispatch/invoices');
export const checkoutConsignment = (data) => API.post('/dispatch/checkout', data);