
import ApiService from "../../reducers/api/Api.jsx";

export const toggleFavorite = useCallback(async (productId) => {
  try {
    const res = await ApiService.put(`/users/favorites/${productId}/toggle`);
    const updatedFavorites = res?.favorites || res?.data?.favorites || [];

    dispatch({ type: "SET_FAVORITES", payload: updatedFavorites });
    dispatch({
      type: "SET_USER",
      payload: state.user
        ? { ...state.user, favorites: updatedFavorites }
        : { favorites: updatedFavorites },
    });

    const isFavorite = updatedFavorites.some((f) =>
      typeof f === "string" ? f === productId : f._id === productId
    );

    return { favorites: updatedFavorites, isFavorite };
  } catch (err) {
    console.error("Error toggling favorite:", err);
    return null;
  }
}, [state.user]);
