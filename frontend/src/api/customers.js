import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const customerApi = {
  getAll: () => api.get(ENDPOINTS.customers.base),
  getById: (id) => api.get(ENDPOINTS.customers.byId(id)),
  create: (data) => api.post(ENDPOINTS.customers.base, data),
  update: (id, data) => api.patch(ENDPOINTS.customers.byId(id), data),
  delete: (id) => api.delete(ENDPOINTS.customers.byId(id)),
  getTotal: () => api.get(ENDPOINTS.customers.count),
};
