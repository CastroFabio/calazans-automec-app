import api from "./config";

export const carApi = {
  getAll: () => api.get("/cars"),
  getById: (id) => api.get(`/cars/${id}`),
  create: (data) => api.post("/cars", data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
};
