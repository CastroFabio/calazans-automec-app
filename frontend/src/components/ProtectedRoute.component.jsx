import { Navigate, Outlet } from "react-router-dom";
import Loading from "../pages/Loading";
import { PATHS } from "../utils/paths";
import { useAuth } from "../context/Auth.context";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading, accessToken } = useAuth();

  if (loading) return <Loading />;

  if (!isAuthenticated) {
    return <Navigate to={PATHS.login} replace />;
  }

  return <Outlet />;
};
