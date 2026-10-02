import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const orderApi = {
  // Buscar todas as ordens de serviço
  getAll: () => api.get(ENDPOINTS.orders.base),
  getMetricsDashboard: () => api.get(ENDPOINTS.orders.metrics),
  getAllPerPage: (params = {}) => {
    const { page = 1, limit = 10, search = "", status = null } = params;
    return api.get(ENDPOINTS.orders.perPage, {
      params: { page, limit, search, status },
    });
  },
  getById: (id) => api.get(ENDPOINTS.orders.byId(id)),
  create: (data) => api.post(ENDPOINTS.orders.base, data),
  update: (id, data) => api.patch(ENDPOINTS.orders.byId(id), data),
  updateStatus: (id, status) =>
    api.patch(ENDPOINTS.orders.status(id), { status }),
  delete: (id) => api.delete(ENDPOINTS.orders.byId(id)),
  getByCustomer: (customerId) =>
    api.get(ENDPOINTS.customers.orders(customerId)),
  getByVehicle: (vehicleId) => api.get(ENDPOINTS.cars.maintenance(vehicleId)),
  getByStatus: (status) => api.get(`/service-order/status/${status}`),
  getTotal: () => api.get(ENDPOINTS.orders.count),
  recalculateTotal: (id) => api.patch(`/service-order/${id}/recalculate`),
};
