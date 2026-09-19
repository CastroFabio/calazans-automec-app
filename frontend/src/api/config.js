import axios from "axios";
import { PATHS } from "../utils/paths";
import { JWT_TOKENS } from "../utils/jwtConstant";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Injeta o Access Token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(JWT_TOKENS.accessToken);
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

    // Evita loop se a própria requisição que falhou for a de refresh ou login
    if (
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    // Se o erro for 401 e a requisição ainda não foi reexecutada
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(JWT_TOKENS.refreshToken);
        if (!refreshToken) throw new Error("Sem refresh token");

        // IMPORTANTE: Faz a chamada com a instância pura do axios para não cair no interceptor
        const res = await axios.post(
          `${API_BASE_URL}auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        if (!accessToken) {
          throw new Error("Token de acesso não retornado pelo servidor.");
        }

        // Salva com a chave correta no localStorage
        localStorage.setItem(JWT_TOKENS.accessToken, accessToken);

        if (newRefreshToken) {
          localStorage.setItem(JWT_TOKENS.refreshToken, newRefreshToken);
        }

        // Atualiza o cabeçalho e reexecuta a requisição original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Limpa o storage e redireciona caso o refresh falhe
        localStorage.removeItem(JWT_TOKENS.accessToken);
        localStorage.removeItem(JWT_TOKENS.refreshToken);
        window.location.href = PATHS.login;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
