import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const vehicleApi = {
  getAll: () => api.get(ENDPOINTS.vehicles.base),
  getById: (id) => api.get(ENDPOINTS.vehicles.byId(id)),
  create: (data) => api.post(ENDPOINTS.vehicles.base, data),
  update: (id, data) => api.put(ENDPOINTS.vehicles.byId(id), data),
  delete: (id) => api.delete(ENDPOINTS.vehicles.byId(id)),
};
