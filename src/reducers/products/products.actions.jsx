import apiService from "../api/Api.jsx";

class ProductsActions {
  // Obtener todos los productos
  async getProducts() {
    try {
      const response = await apiService.get("/products");
      // Api puede devolver { products: [...] } o response.data.products
      const products = response.products || response.data?.products || [];
      console.log("✅ Productos obtenidos (actions):", products);
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
      const product = response.product || response.data?.product || null;
      return product;
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
      const product = response.product || response.data?.product || null;
      return product;
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
  async toggleLike(productId, addLike, userId) {
    try {
      // Construimos la URL con ambos parámetros
      const url = `/products/toggleLike/${productId}/${addLike}`;
      // Enviamos el userId en el body para que el backend lo agregue o elimine
      const response = await apiService.put(url, { likes: [userId] });
      const product = response.data?.product || null;
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

// Exportamos la instancia directamente
export default new ProductsActions();
