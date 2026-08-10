import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const maintenanceJobApi = {
  // Buscar todos os serviços de manutenção
  getAll: () => api.get(ENDPOINTS.maintenanceJobs.base),

  // Buscar um serviço por ID
  getById: (id) => api.get(ENDPOINTS.maintenanceJobs.byId(id)),

  // Buscar serviços por grupo
  getByGroup: (groupId) => api.get(ENDPOINTS.maintenanceJobs.byGroup(groupId)),

  // Criar novo serviço
  create: (data) => api.post(ENDPOINTS.maintenanceJobs.base, data),

  // Atualizar serviço
  update: (id, data) => api.patch(ENDPOINTS.maintenanceJobs.byId(id), data),

  // Remover serviço
  delete: (id) => api.delete(ENDPOINTS.maintenanceJobs.byId(id)),
};
