import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import Loading from "../Loading/Loading.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();
  if (loading) {
    return <Loading />;
  }

  const token = localStorage.getItem("token");
  if (!isAuthenticated || !token) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/home" replace />;
  }

  if (!adminOnly && isAdmin() && window.location.pathname === "/home") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
