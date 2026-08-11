import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const orderApi = {
  // Buscar todas as ordens de serviço
  getAll: () => api.get(ENDPOINTS.orders.base),

  // Buscar uma ordem por ID
  getById: (id) => api.get(ENDPOINTS.orders.byId(id)),

  // Criar nova ordem
  create: (data) => api.post(ENDPOINTS.orders.base, data),

  // Atualizar ordem
  update: (id, data) => api.put(ENDPOINTS.orders.byId(id), data),

  // Atualizar status da ordem
  updateStatus: (id, status) =>
    api.patch(ENDPOINTS.orders.status(id), { status }),

  // Remover ordem
  delete: (id) => api.delete(ENDPOINTS.orders.byId(id)),

  // Buscar ordens por cliente
  getByCustomer: (customerId) =>
    api.get(ENDPOINTS.customers.orders(customerId)),

  // Buscar ordens por veículo
  getByVehicle: (vehicleId) => api.get(ENDPOINTS.cars.maintenance(vehicleId)),

  // Buscar ordens por status
  getByStatus: (status) => api.get(`/service-order/status/${status}`),

  // Buscar quantidade total
  getTotal: () => api.get(ENDPOINTS.orders.count),

  // Recalcular total da ordem
  recalculateTotal: (id) => api.patch(`/service-order/${id}/recalculate`),
};
