import API from './api';

export const getCustomers = () => API.get('/customers');

export const getCustomer = (id) =>
  API.get(`/customers/${id}`);

export const getCustomerProfile = (id) =>
  API.get(`/customers/${id}`);

export const searchCustomerByPhone = (phone) =>
  API.get('/customers/search', { params: { phone } });

export const saveCustomer = (data) =>
  API.post('/customers', data);

export const updateCustomer = (id, data) =>
  API.put(`/customers/${id}`, data);