import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth";
import { JWT_TOKENS } from "../utils/jwtConstant";

// Criar o Contexto
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    async function loadStorageData() {
      const token = localStorage.getItem(JWT_TOKENS.accessToken); //

      if (token) {
        try {
          const response = await authApi.getMe(); //
          setUser(response.data); //
          setIsAuthenticated(true); //
        } catch (err) {
          // Token inválido/expirado
          localStorage.removeItem(JWT_TOKENS.accessToken); //
          localStorage.removeItem(JWT_TOKENS.refreshToken); //
          setUser(null); //
          setIsAuthenticated(false); //
        }
      }

      setLoading(false); //
    }

    loadStorageData();
  }, []);

  const loginService = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { accessToken, refreshToken, user: userData } = response.data;

    localStorage.setItem(JWT_TOKENS.accessToken, accessToken);
    if (refreshToken)
      localStorage.setItem(JWT_TOKENS.refreshToken, refreshToken);

    setUser(userData);
    setIsAuthenticated(true);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem(JWT_TOKENS.accessToken);
    localStorage.removeItem(JWT_TOKENS.refreshToken);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated,
        loading,
        loginService,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
