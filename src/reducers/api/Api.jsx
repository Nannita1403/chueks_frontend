const API_BASE_URL = "http://localhost:3000/api/v1";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("token");
    console.log("🔧 ApiService inicializado con URL:", this.baseURL);
  }

  // Configura o elimina token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
      console.log("🔑 Token configurado");
    } else {
      localStorage.removeItem("token");
      console.log("🔑 Token removido");
    }
  }

  // Encabezados
  getHeaders(isFormData = false) {
    const headers = {};
    if (!isFormData) headers["Content-Type"] = "application/json";
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
    return headers;
  }

  async request(endpoint, options = {}, isFormData = false) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(isFormData),
      ...options,
    };

    console.log("📡 Petición:", {
      url,
      method: config.method || "GET",
      headers: config.headers,
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, { ...config, signal: controller.signal });
      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      const rawData = contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(rawData.message || rawData || "Error en la petición");
      }

      console.log("✅ Petición exitosa:", rawData);

      // 🔹 Normalización: siempre devolvemos el array directamente si existe
      if (rawData?.data) return rawData.data;
      if (Array.isArray(rawData)) return rawData;
      return rawData;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("⏰ La petición tardó demasiado");
      if (error.name === "TypeError") throw new Error(`❌ No se puede conectar al servidor en ${this.baseURL}`);
      throw error;
    }
  }

  // Métodos HTTP
  get(endpoint) { return this.request(endpoint, { method: "GET" }); }
  post(endpoint, data) { return this.request(endpoint, { method: "POST", body: JSON.stringify(data) }); }
  put(endpoint, data) { return this.request(endpoint, { method: "PUT", body: JSON.stringify(data) }); }
  delete(endpoint) { return this.request(endpoint, { method: "DELETE" }); }

  // FormData
  postFormData(endpoint, formData) { return this.request(endpoint, { method: "POST", body: formData }, true); }
  putFormData(endpoint, formData) { return this.request(endpoint, { method: "PUT", body: formData }, true); }
}

export default new ApiService();
