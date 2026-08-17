import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const itemMaintenanceApi = {
  // Criar um único item
  create: (data) => api.post(ENDPOINTS.itemMaintenances.base, data),

  // Criar múltiplos itens de uma vez (BATCH)
  createBatch: (items) =>
    api.post(`${ENDPOINTS.itemMaintenances.base}/batch`, { items }),

  // Buscar por ordem de serviço
  getByOrder: (orderId) => api.get(ENDPOINTS.itemMaintenances.byOrder(orderId)),

  update: (id, data) => api.patch(ENDPOINTS.itemMaintenances.byId(id), data),

  delete: (id) => api.delete(ENDPOINTS.itemMaintenances.byId(id)),
};
