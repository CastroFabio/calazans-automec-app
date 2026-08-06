import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const materialApi = {
  // Buscar todos os materiais
  getAll: () => api.get(ENDPOINTS.materials.base),

  // Buscar um material por ID
  getById: (id) => api.get(ENDPOINTS.materials.byId(id)),

  // Buscar materiais por grupo
  getByGroup: (groupId) => api.get(ENDPOINTS.materials.byGroup(groupId)),

  // Criar novo material
  create: (data) => api.post(ENDPOINTS.materials.base, data),

  // Atualizar material
  update: (id, data) => api.put(ENDPOINTS.materials.byId(id), data),

  // Remover material
  delete: (id) => api.delete(ENDPOINTS.materials.byId(id)),
};
