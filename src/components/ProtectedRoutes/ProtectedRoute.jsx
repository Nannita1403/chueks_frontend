import { Navigate } from "react-router-dom"
import { Spinner, Center } from "@chakra-ui/react"
import { useAuth } from "../../context/api/api.context.jsx"

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // If admin route is required, check admin role
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  // If user is admin trying to access user dashboard, redirect to admin
  if (!adminOnly && isAdmin() && window.location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute
