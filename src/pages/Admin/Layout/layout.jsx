import { redirect } from "next/navigation"
import { AdminSidebar } from "../../components/admin/admin-sidebar"

export const metadata = {
  title: "CHUEKS Admin - Panel de Administración",
  description: "Panel de administración para la gestión de productos y pedidos",
}

// Esta función simula la verificación de autenticación y autorización
// En una implementación real, esto verificaría la sesión del usuario y sus permisos
function isAuthenticated() {
  // Simulación: siempre devuelve true para la demo
  return true
}

function isAdmin() {
  // Simulación: siempre devuelve true para la demo
  return true
}

export default function AdminLayout({ children }) {
  // Verificar autenticación y autorización
  const authenticated = isAuthenticated()
  const isAdminUser = isAdmin()

  // Redireccionar si no está autenticado o no es administrador
  if (!authenticated || !isAdminUser) {
    redirect("/")
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f7fafc", display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>{children}</div>
    </div>
  )
}
