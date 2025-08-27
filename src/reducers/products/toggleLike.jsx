import ProductsActions from "../../reducers/products/products.actions.jsx";

// 👉 Función que combina API + actualización del estado local
export const toggleLike = async (productId, addLike, products, setProducts) => {
  try {
    console.log("[toggleLike] Enviando petición al backend...", { productId, addLike });

    // 🔥 Llamada al backend
    const updatedProduct = await ProductsActions.toggleLike(productId, addLike);

    console.log("[toggleLike] Respuesta backend:", updatedProduct);

    // 🔄 Reemplazar solo el producto actualizado en el array
    const updatedProducts = products.map((p) =>
      p._id === productId ? updatedProduct : p
    );

    // ✅ Actualizar estado en Home
    setProducts(updatedProducts);

  } catch (error) {
    console.error("[toggleLike] Error:", error);
  }
};
