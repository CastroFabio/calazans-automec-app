import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const customerApi = {
  getAll: () => api.get(ENDPOINTS.customers.base),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post("/customers", data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};
