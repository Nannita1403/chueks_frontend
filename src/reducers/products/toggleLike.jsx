import ProductsActions from "../../reducers/products/products.actions.jsx";

export const toggleLike = async (productId, addLike, products, setProducts) => {
  try {
    console.log("[toggleLike] Enviando petición al backend...", { productId, addLike });

    const updatedProduct = await ProductsActions.toggleLike(productId, addLike);

    console.log("[toggleLike] Respuesta backend:", updatedProduct);

    const updatedProducts = products.map((p) =>
      p._id === productId ? updatedProduct : p
    );

    setProducts(updatedProducts);

  } catch (error) {
    console.error("[toggleLike] Error:", error);
  }
};
