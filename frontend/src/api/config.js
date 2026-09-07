import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

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
    if (!error.response) {
      const customError = {
        message:
          "O servidor está temporariamente indisponível. Tente novamente mais tarde.",
        isNetworkError: true,
        status: 503,
      };
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  },
);

export default api;
