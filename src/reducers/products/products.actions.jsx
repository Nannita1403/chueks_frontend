// products.actions.jsx
import apiService from "../api/Api.jsx";

class ProductsActions {
  // Obtener todos los productos
  async getProducts() {
  try {
    const response = await apiService.get("/products");

    // ApiService devuelve { endpoint, data }
    const products = Array.isArray(response.data) ? response.data : response.data?.products || [];
    
    console.log("✅ Productos obtenidos:", products);
    return products;
  } catch (error) {
    console.error("❌ Error obteniendo productos:", error);
    throw error;
  }
}

  // Obtener un producto por ID
  async getProduct(id) {
    try {
      const response = await apiService.get(`/products/${id}`);
      const product = response.product || response.data?.product || null;
      return product;
    } catch (error) {
      console.error(`❌ Error obteniendo producto ${id}:`, error);
      throw error;
    }
  }

  // Crear un producto (admin)
  async createProduct(productData) {
    try {
      const formData = this.buildFormData(productData);
      const response = await apiService.postFormData("/products", formData);
      return response.product || response.data?.product || null;
    } catch (error) {
      console.error("❌ Error creando producto:", error);
      throw error;
    }
  }

  // Actualizar un producto (admin)
  async updateProduct(id, productData) {
    try {
      const formData = this.buildFormData(productData);
      const response = await apiService.putFormData(`/products/${id}`, formData);
      return response.product || response.data?.product || null;
    } catch (error) {
      console.error(`❌ Error actualizando producto ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un producto (admin)
  async deleteProduct(id) {
    try {
      return await apiService.delete(`/products/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando producto ${id}:`, error);
      throw error;
    }
  }

  // Alternar "like" de un producto
  async toggleLike(productId, addLike) {
    try {
      const response = await apiService.put(`/products/toggleLike/${productId}/${addLike}`);
      const product = response.product || response.data?.product || null;
      console.log("✅ Like actualizado:", product);
      return product;
    } catch (error) {
      console.error(`❌ Error toggling like producto ${productId}:`, error);
      throw error;
    }
  }

  // Construir FormData para creación/actualización
  buildFormData(data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "imgPrimary" || key === "imgSecondary") {
        if (data[key]) formData.append(key, data[key]);
      } else {
        formData.append(key, Array.isArray(data[key]) ? JSON.stringify(data[key]) : data[key]);
      }
    });
    return formData;
  }
}

export default new ProductsActions();
