import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const materialGroupApi = {
  // Buscar todos os grupos de material
  getAll: () => api.get(ENDPOINTS.materialGroups.base),

  // Buscar um grupo por ID
  getById: (id) => api.get(ENDPOINTS.materialGroups.byId(id)),

  // Buscar materiais de um grupo
  getMaterials: (id) => api.get(ENDPOINTS.materialGroups.materials(id)),

  // Criar novo grupo
  create: (data) => api.post(ENDPOINTS.materialGroups.base, data),

  // Atualizar grupo
  update: (id, data) => api.patch(ENDPOINTS.materialGroups.byId(id), data),

  // Remover grupo
  delete: (id) => api.delete(ENDPOINTS.materialGroups.byId(id)),

  getTotal: () => api.get(ENDPOINTS.materialGroups.count),
};
