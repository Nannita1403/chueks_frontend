
import ApiService from "../../reducers/api/Api.jsx";

export const toggleFavorite = async (productId, toast, refreshFavorites) => {
  try {
    await ApiService.put(`/users/favorites/${productId}/toggle`);
    if (typeof refreshFavorites === "function") {
      await refreshFavorites();
    }
    toast({ title: "Favoritos actualizados", status: "success" });
  } catch (err) {
    console.error("❌ Error al actualizar favoritos:", err);
    toast({ title: "Error al actualizar favoritos", status: "error" });
  }
};