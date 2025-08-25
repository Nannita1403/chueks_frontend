// API configuration and base service
const API_BASE_URL = "http://localhost:3000/api/v1"

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem("token")
    console.log("🔧 ApiService inicializado con URL:", this.baseURL)
  }

  // Set authorization token
  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem("token", token)
      console.log("🔑 Token configurado")
    } else {
      localStorage.removeItem("token")
      console.log("🔑 Token removido")
    }
  }

  // Get authorization headers
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
      console.log("📋 Headers con autorización configurados")
    } else {
      console.log("📋 Headers sin autorización")
    }

    return headers
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: this.getHeaders(),
      ...options,
    }

    console.log("📡 Haciendo petición:", { url, method: options.method || "GET", headers: config.headers })

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.error("⏰ Petición timeout después de 10 segundos")
        controller.abort()
      }, 10000)

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      console.log("📡 Respuesta recibida:", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      })

      if (response.status === 404) {
        console.error("❌ Endpoint no encontrado:", url)
        throw new Error(
          `Endpoint no encontrado: ${endpoint}. Verifica que el backend esté corriendo en ${this.baseURL}`,
        )
      }

      const contentType = response.headers.get("content-type")
      console.log("📡 Content-Type:", contentType)
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Respuesta no es JSON:", contentType)
        const text = await response.text()
        console.error("❌ Contenido de respuesta:", text)
        throw new Error(`El servidor no devolvió JSON válido. Contenido: ${text}`)
      }

      console.log("📡 Parseando JSON...")
      const data = await response.json()
      console.log("📡 JSON parseado exitosamente")
      console.log("📡 Datos de respuesta completos:", JSON.stringify(data, null, 2))
      console.log("📡 Estructura de respuesta:", {
        hasMessage: !!data.message,
        hasToken: !!data.token,
        hasUser: !!data.user,
        keys: Object.keys(data),
      })


      if (!response.ok) {
        console.error("❌ Error en respuesta:", data)
        throw new Error(data.message || data || "Error en la petición")
      }

      console.log("✅ Petición exitosa:", { endpoint, data })
      return data
    } catch (error) {
      console.error("❌ Error en petición:", error)
      if (error.name === "AbortError") {
        throw new Error("La petición tardó demasiado tiempo. Verifica la conexión con el backend.")
      }

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(`No se puede conectar al servidor en ${this.baseURL}. Verifica que el backend esté corriendo.`)
      }
      
      throw error
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" })
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" })
  }

  // POST with FormData (for file uploads)
  async postFormData(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {}

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    console.log("📡 Enviando FormData:", { url, headers })

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data || "Error en la petición")
      }

      return data
    } catch (error) {
      console.error("❌ Error en FormData:", error)
      throw error
    }
  }

  // PUT with FormData (for file uploads)
  async putFormData(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {}

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data || "Error en la petición")
      }

      return data
    } catch (error) {
      console.error("❌ Error en FormData PUT:", error)
      throw error
    }
  }
}

export default new ApiService()
