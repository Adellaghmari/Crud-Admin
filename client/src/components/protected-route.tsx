import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-slate-500">Laddar...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
};
