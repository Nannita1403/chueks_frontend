import axios from "axios";
import apiService from "../api/Api.jsx";

class ProductsActions {
  async getProducts() {
    try {
      const response = await apiService.get("/products");
      console.log("🔍 Respuesta cruda de API:", response);

      const products =
        response?.data?.products ||
        response.products ||
        (Array.isArray(response) ? response : []);

      console.log("✅ Productos obtenidos (actions):", products);
      return products;
    } catch (error) {
      console.error("❌ Error obteniendo productos:", error);
      throw error;
    }
  }

  async getProduct(id) {
    try {
      const response = await apiService.get(`/products/${id}`);
      const product = response?.data?.product || response.product || null;
      return product;
    } catch (error) {
      console.error(`❌ Error obteniendo producto ${id}:`, error);
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      const formData = this.buildFormData(productData);
      const response = await apiService.postFormData("/products", formData);

      const product = response?.data?.product || response.product || null;
      console.log("✅ Producto creado:", product);
      return product;
    } catch (error) {
      console.error("❌ Error creando producto:", error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const formData = this.buildFormData(productData);
      const response = await apiService.putFormData(`/products/${id}`, formData);

      const product = response?.data?.product || response.product || null;
      console.log("✅ Producto actualizado:", product);
      return product;
    } catch (error) {
      console.error(`❌ Error actualizando producto ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const response = await apiService.delete(`/products/${id}`);
      console.log("🗑️ Producto eliminado:", response);
      return response;
    } catch (error) {
      console.error(`❌ Error eliminando producto ${id}:`, error);
      throw error;
    }
  }

  async toggleLike(productId, addLike) {
    try {
      const res = await axios.put(
        `https://chueks-backend.vercel.app/api/v1/products/toggleLike/${productId}/${addLike}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("👍 Toggle like:", res.data.product);
      return res.data.product;
    } catch (error) {
      console.error("❌ Error en toggleLike:", error);
      throw error;
    }
  }

  buildFormData(data) {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (!value && value !== 0) return; 

      if (key === "imgPrimary" || key === "imgSecondary") {
        if (value instanceof File) {
          formData.append(key, value);
        }
      } else if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    return formData;
  }
}

export default new ProductsActions();
