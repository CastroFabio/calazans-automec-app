import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const customerApi = {
  getAll: () => api.get(ENDPOINTS.customers.base),
  getById: (id) => api.get(ENDPOINTS.customers.byId),
  create: (data) => api.post(ENDPOINTS.customers.base, data),
  update: (id, data) => api.put(ENDPOINTS.customers.byId, data),
  delete: (id) => api.delete(ENDPOINTS.customers.byId),
  getTotal: () => api.get(ENDPOINTS.customers.count),
};
