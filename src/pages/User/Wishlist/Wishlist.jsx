// src/pages/User/Favorites/Favorites.jsx
import { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, Text, Spinner } from "@chakra-ui/react";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import { toggleFavorite } from "../../../components/ToggleFavorite/ToggleFavorite.jsx";

const Favorites = () => {
  const { user, favorites, refreshFavorites } = useAuth();
  const [loading, setLoading] = useState(true);
const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        await refreshFavorites();
      } catch (err) {
        console.error("❌ Error cargando favoritos:", err);
        toast({ title: "Error cargando favoritos", status: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <Box p={6} textAlign="center">
        <Text>Debes iniciar sesión para ver tus favoritos.</Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner />
        <Text mt={2}>Cargando tus favoritos…</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Mis Favoritos ❤️
      </Heading>

      {!favorites || favorites.length === 0 ? (
        <Text>No tienes productos en favoritos</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {favorites.map((product) => (
            <ProductComponent
              key={product._id}
              product={product}
              isFavorite
              showAddToCart
              onToggleLike={() => toggleFavorite(product._id, toast, refreshFavorites)}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Favorites;
