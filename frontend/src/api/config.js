import axios from "axios";
import { PATHS } from "../utils/paths";
import { authApi } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Injeta o Access Token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para renovação automática via Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e a requisição ainda não foi reexecutada
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Sem refresh token");

        // Chama o endpoint de refresh enviando o refreshToken no header
        const res = await authApi.refreshToken(refreshToken);

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        // Salva os novos tokens no localStorage
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Atualiza o cabeçalho e reexecuta a requisição original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se a renovação falhar (Refresh Token expirado), desloga o usuário
        localStorage.removeItem("access_token");
        localStorage.removeItem("refreshToken");
        window.location.href = PATHS.login;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
