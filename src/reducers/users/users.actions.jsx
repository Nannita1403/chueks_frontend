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

    // Normalizar payload a lo que espera el backend
    const payload = {
      email: credentials.email || credentials.username, 
      password: credentials.password,
    }
    console.log("📡 Payload final que viaja a API:", payload)

    const response = await apiService.post("/users/login", payload)
    console.log("📡 Respuesta del login:", response)

    if (response.token) {
      console.log("🔑 Token recibido, guardando...")
      apiService.setToken(response.token)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      console.log("✅ Usuario y token guardados en localStorage")
    } else {
      console.warn("⚠️ No se recibió token en la respuesta:", response)
    }

    return response
  } catch (error) {
    console.error("❌ Error en login:", error)

    if (error.response && error.response.data) {
      const errorMessage = error.response.data.message || error.response.data
      console.log("📝 Mensaje de error del backend:", errorMessage)

      const customError = new Error(errorMessage)
      customError.isVerificationError = errorMessage.includes("Verifica tu correo")
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
