import API from './api';

// Get all purchase orders
export const getPurchaseOrders = () => {
  return API.get('/purchase-orders');
};

// Get single purchase order
export const getPurchaseOrder = (id) => {
  return API.get(`/purchase-orders/${id}`);
};

// Create new purchase order
export const createPurchaseOrder = (purchaseOrderData) => {
  return API.post('/purchase-orders', purchaseOrderData);
};

// Update purchase order status
export const updatePoStatus = (id, status) => {
  return API.put(`/purchase-orders/${id}/status`, null, {
    params: {
      status
    }
  });
};

