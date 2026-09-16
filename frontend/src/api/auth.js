import api from "./config";
import { ENDPOINTS } from "./endpoints";

export const authApi = {
  getMe: () => api.get(ENDPOINTS.auth.fetchMe),
  login: (loginData) => api.post(ENDPOINTS.auth.login, loginData),
  refreshToken: (refreshToken) =>
    api.post(
      ENDPOINTS.auth.refresh,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    ),
};
