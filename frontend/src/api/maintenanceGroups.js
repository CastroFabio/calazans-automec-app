import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const maintenanceGroupApi = {
  // Buscar todos os grupos de manutenção
  getAll: () => api.get(ENDPOINTS.maintenanceGroups.base),

  // Buscar um grupo por ID
  getById: (id) => api.get(ENDPOINTS.maintenanceGroups.byId(id)),

  // Buscar serviços de manutenção de um grupo
  getJobs: (id) => api.get(ENDPOINTS.maintenanceGroups.jobs(id)),

  // Criar novo grupo
  create: (data) => api.post(ENDPOINTS.maintenanceGroups.base, data),

  // Atualizar grupo
  update: (id, data) => api.patch(ENDPOINTS.maintenanceGroups.byId(id), data),

  // Remover grupo
  delete: (id) => api.delete(ENDPOINTS.maintenanceGroups.byId(id)),
};
