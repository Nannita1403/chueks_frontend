import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/Auth/auth.context.jsx"
import Loading from "../../components/Loading/Loading.jsx"

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth()

  // Show loading spinner while checking authentication
  /*if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }*/
 
 console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "user:", user, "loading:", loading)

 if (loading) {
    console.log("ProtectedRoute - Still loading, showing Loading component")
    return <Loading />
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to /auth")
    return <Navigate to="/auth" replace />
  }

  // If admin route is required, check admin role
  if (adminOnly && !isAdmin()) {
    console.log("ProtectedRoute - Admin required but user is not admin, redirecting to /dashboard")
    return <Navigate to="/dashboard" replace />
  }

  // If user is admin trying to access user dashboard, redirect to admin
  if (!adminOnly && isAdmin() && window.location.pathname === "/dashboard") {
    console.log("ProtectedRoute - Admin user accessing /dashboard, redirecting to /admin")
    return <Navigate to="/admin" replace />
  }
  
  console.log("ProtectedRoute - Authentication passed, rendering children")
  return children
}

export default ProtectedRoute
