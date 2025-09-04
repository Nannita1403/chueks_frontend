import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import Loading from "../Loading/Loading.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();

  // Mientras cargamos el estado de autenticación
  if (loading) {
    return <Loading />;
  }

  // Si no está autenticado (ni token en localStorage), redirige a login
  const token = localStorage.getItem("token");
  if (!isAuthenticated || !token) {
    return <Navigate to="/auth" replace />;
  }

  // Si la ruta es solo para admins, verifica rol
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/home" replace />;
  }

  // Si el usuario es admin y accede a /home, lo mando a /admin
  if (!adminOnly && isAdmin() && window.location.pathname === "/home") {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Autenticación y permisos correctos
  return children;
};

export default ProtectedRoute;
