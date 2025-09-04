export const toggleFavorite = async (productId) => {
  try {
    await ApiService.put(`/users/favorites/${productId}/toggle`);
    await refreshFavorites();
    toast({
      title: "Favoritos actualizados",
      status: "success",
    });
  } catch (err) {
    console.error("❌ Error al actualizar favoritos:", err);
    toast({ title: "Error al actualizar favoritos", status: "error" });
  }
};