import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de erro simples
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Extrai mensagem de erro da resposta
      const message = error.response.data?.message || "Erro na requisição";
      error.message = message;
    } else if (error.request) {
      error.message = "Servidor não respondeu";
    } else {
      error.message = "Erro ao fazer requisição";
    }
    return Promise.reject(error);
  },
);

export default api;
