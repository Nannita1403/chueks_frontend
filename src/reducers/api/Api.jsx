// API configuration and base service
const API_BASE_URL = "http://localhost:3000/api/v1"

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem("token")
  }

  // Set authorization token
  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
  }

  // Get authorization headers
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers.Authorization = this.token
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

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data || "Error en la petición")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
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
      headers.Authorization = this.token
    }

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
      console.error("API Error:", error)
      throw error
    }
  }

  // PUT with FormData (for file uploads)
  async putFormData(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {}

    if (this.token) {
      headers.Authorization = this.token
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
      console.error("API Error:", error)
      throw error
    }
  }
}

export default new ApiService()
