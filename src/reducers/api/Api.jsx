const localUrl = 'http://localhost:3000/api/v1';
const vercelUrl = 'https://chueks-backend.vercel.app/api/v1'; 

export const DEFAULT_BASE = vercelUrl;
const API_BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  (typeof window !== "undefined" && window.__API_BASE_URL__) ||
  DEFAULT_BASE;

class ApiService {
    constructor() {
      this.baseURL = API_BASE_URL;
      this.token = localStorage.getItem("token"); 
      console.log("🔧 ApiService inicializado con URL:", this.baseURL);
    }

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

  getHeaders(isFormData = false) {
  const headers = {};
  const token = this.token || localStorage.getItem("token"); 
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

  async request(endpoint, options = {}, isFormData = false) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: options.method || "GET",
      headers: this.getHeaders(isFormData),
      body: options.body ?? undefined,
    };

    console.log("📡 Petición:", {
      url,
      method: config.method,
      headers: config.headers,
      body: isFormData ? "[FormData]" : options.body,
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, { ...config, signal: controller.signal });
      clearTimeout(timeoutId);

      const ct = response.headers.get("content-type") || "";
      const data = ct.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message =
          typeof data === "object" && data?.message ? data.message : data;
        throw new Error(message || "Error en la petición");
      }

      console.log("✅ Petición exitosa:", data);

       if (data?.data) return data.data;
      if (data?.products) return data.products;
      if (Array.isArray(data)) return data;
      return data;
    } catch (error) {
      if (error.name === "AbortError")
        throw new Error("⏰ La petición tardó demasiado");
      if (error.name === "TypeError") {
        throw new Error(`❌ No se puede conectar al servidor en ${this.baseURL}`);
      }
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  postFormData(endpoint, formData) {
    return this.request(endpoint, { method: "POST", body: formData }, true);
  }

  putFormData(endpoint, formData) {
    return this.request(endpoint, { method: "PUT", body: formData }, true);
  }

  deleteFormData(endpoint, formData) {
    return this.request(endpoint, { method: "DELETE", body: formData }, true);
  }
}

export default new ApiService();
