import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const itemMaterialApi = {
  // Criar um único item
  create: (data) => api.post(ENDPOINTS.itemMaterials.base, data),

  // Criar múltiplos itens de uma vez (BATCH)
  createBatch: (items) =>
    api.post(`${ENDPOINTS.itemMaterials.base}/batch`, { items }),

  // Buscar por ordem de serviço
  getByOrder: (orderId) => api.get(ENDPOINTS.itemMaterials.byOrder(orderId)),
};
