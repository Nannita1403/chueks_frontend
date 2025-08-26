// src/actions/toggleLike.jsx
import ProductsActions from "../../reducers/products/products.actions.jsx";

// 👉 Función que combina API + dispatch
export const toggleLike = async (productId, dispatch, addLike, products) => {
  try {
    console.log("[toggleLike] Enviando petición al backend...", { productId, addLike });

    // 🔥 Llamada a tu servicio centralizado
    const updatedProduct = await ProductsActions.toggleLike(productId, addLike);

    console.log("[toggleLike] Respuesta backend:", updatedProduct);

    // 🔄 Actualizar estado local
    const updatedProducts = products.map((p) =>
      p._id === productId ? updatedProduct : p
    );

    dispatch({
      type: "SET_PRODUCTS",
      payload: updatedProducts,
    });

  } catch (error) {
    console.error("[toggleLike] Error:", error);
  }
};
