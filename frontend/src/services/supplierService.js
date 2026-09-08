import API from "./api";

export const getSuppliers = () => {
  return API.get("/suppliers");
};

export const createSupplier = (supplierData) => {
  return API.post("/suppliers", supplierData);
};

export const stockInward = (inwardData) => {
  return API.post("/suppliers/stock-inward", inwardData);
};