import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import { ProductCardSkeleton } from "../../components/Loading-Skeleton/loading-skeleton.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "user:", user, "loading:", loading);

  // Mientras cargamos el estado de autenticación
  if (loading) {
    console.log("ProtectedRoute - Still loading, showing Loading component");
    return <ProductCardSkeleton />;
  }

  // Si no está autenticado, redirige a login
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // Si la ruta es solo para admins, verifica rol
  if (adminOnly && !isAdmin()) {
    console.log("ProtectedRoute - Admin required but user is not admin, redirecting to /home");
    return <Navigate to="/home" replace />;
  }

  // Si el usuario es admin y accede a ruta de usuario normal (/home), redirige a /admin
  if (!adminOnly && isAdmin() && window.location.pathname === "/home") {
    console.log("ProtectedRoute - Admin user accessing /home, redirecting to /admin");
    return <Navigate to="/admin" replace />;
  }

  // Autenticación y permisos correctos
  console.log("ProtectedRoute - Authentication passed, rendering children");
  return children;
};

export default ProtectedRoute;
