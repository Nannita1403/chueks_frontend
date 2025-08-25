import apiService from "../api/Api.jsx"

class authService {
  // Register new user
  async register(userData) {
    try {
      console.log("📡 Enviando registro a API:", userData)

      const response = await apiService.post("/users/register", userData)
      console.log("📡 Respuesta del registro:", response)
      return response
    } catch (error) {
      console.error("❌ Error en registro:", error)
      throw error
    }
  }
  // Login user

  async login(credentials) {
    try {
      console.log("📡 Enviando login a API:", credentials)

      const response = await apiService.post("/users/login", credentials)
      console.log("📡 Respuesta del login:", response)

      if (response && typeof response === "object") {
        console.log("🔍 Analizando respuesta del login:")
        console.log("  - Tipo de respuesta:", typeof response)
        console.log("  - Tiene token:", !!response.token)
        console.log("  - Tiene user:", !!response.user)
        console.log("  - Estructura completa:", JSON.stringify(response, null, 2))
      }

      if (response.token) {
        console.log("🔑 Token recibido, guardando...")
        apiService.setToken(response.token)
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        console.log("✅ Usuario y token guardados en localStorage")
        console.log("👤 Usuario guardado:", response.user)
      } else {
        console.warn("⚠️ No se recibió token en la respuesta")
        console.warn("⚠️ Respuesta completa:", response)
      }

      console.log("🎯 Login completado, retornando respuesta")
      return response
    } catch (error) {
      console.error("❌ Error en login:", error)

      if (error.response && error.response.data) {
        const errorMessage = error.response.data
        console.log("📝 Mensaje de error del backend:", errorMessage)

        // Crear error personalizado con el mensaje exacto del backend
        const customError = new Error(errorMessage)
        customError.isVerificationError = errorMessage.includes("Verifica tu correo")
        customError.originalError = error
        throw customError
      }

      throw error
    }
  }

  // Verify account
  async verifyAccount(id) {
    try {
      console.log("📡 Verificando cuenta:", id)
      const response = await apiService.get(`/users/verify/${id}`)
      console.log("📡 Respuesta de verificación:", response)

      if (response.token) {
        apiService.setToken(response.token)
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
      }

      return response
    } catch (error) {
      console.error("❌ Error en verificación:", error)
      throw error
    }
  }

  // Check session
  async checkSession() {
    try {
      console.log("📡 Verificando sesión...")
      const response = await apiService.get("/users/checksession")
      console.log("📡 Respuesta de sesión:", response)
      return response
    } catch (error) {
      console.error("❌ Error verificando sesión:", error)
      throw error
    }
  }

  // Logout user
  logout() {
    console.log("🚪 Cerrando sesión...")
    apiService.setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    console.log("✅ Sesión cerrada")
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    const isAuth = !!(token && user)
    console.log("🔍 Verificando autenticación:", { token: !!token, user: !!user, isAuth })
    return isAuth
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser()
    const isAdmin = user && user.rol === "admin"
    console.log("👑 Verificando admin:", { user: user?.name, rol: user?.rol, isAdmin })
    return isAdmin
  }
}

export default new authService()
