import { useEffect, useState, useMemo } from "react";
import {
  Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Divider, Spinner
} from "@chakra-ui/react";
import AppHeader from "../../../components/Header/AppHeader.jsx";
import BackButton from "../../../components/Nav/BackButton.jsx";
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";
import ProductModal from "../../../components/ProductModal/ProductModal.jsx";
import { ProductCardSkeleton } from "../../../components/Loading-Skeleton/loading-skeleton.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import ApiService from "../../../reducers/api/Api.jsx";
import { toggleFavorite } from "../../../components/ToggleFavorite/ToggleFavorite.jsx";

export default function Favorites() {
  const { user, favorites, refreshFavorites } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        await refreshFavorites();
      } catch (err) {
        toast({ title: "Error cargando favoritos", status: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  const subtotal = useMemo(() => {
    return (favorites || []).reduce((acc, p) => acc + (p.priceMin || 0), 0);
  }, [favorites]);

  const moveToCart = async (product) => {
    try {
      await ApiService.post("/cart/add", { productId: product._id, quantity: 1 });
      await toggleFavorite(product._id, toast, refreshFavorites);
      toast({ title: `${product.name} agregado al carrito`, status: "success" });
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  if (!user) {
    return (
      <Box minH="100vh" p={6} textAlign="center">
        <AppHeader />
        <BackButton mb={4} />
        <Text>Debes iniciar sesión para ver tus favoritos.</Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box minH="100vh" p={6}>
        <AppHeader />
        <BackButton mb={4} />
        <VStack spacing={6}>
          <Spinner />
          <Text>Cargando tus favoritos…</Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </SimpleGrid>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      <AppHeader />
      <Box bg="pink.500" color="white" py={3}>
        <Container maxW="container.xl">
          <BackButton color="white" variant="link" />
        </Container>
      </Box>

      <Container maxW="container.xl" py={6}>
        <HStack align="start" spacing={6} w="full">
          {/* LISTA DE FAVORITOS */}
          <Box flex={1}>
            <Heading size="lg" mb={6}>Mis Favoritos ❤️</Heading>
            {!favorites || favorites.length === 0 ? (
              <Box
                bg="white"
                _dark={{ bg: "gray.800" }}
                borderWidth={1}
                borderColor="gray.200"
                rounded="md"
                py={10}
                textAlign="center"
              >
                <Text color="gray.600" _dark={{ color: "gray.400" }}>No tienes productos en favoritos</Text>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                {favorites.map((product) => (
                  <Box key={product._id}>
                    <ProductModal
                      isOpen={!!selectedProduct && selectedProduct._id === product._id}
                      onClose={() => setSelectedProduct(null)}
                      product={selectedProduct}
                      addToCartHandler={moveToCart}
                    />

                    <ProductComponent
                      product={product}
                      isFavorite
                      onViewDetail={() => setSelectedProduct(product)}
                      onToggleLike={() => toggleFavorite(product._id, toast, refreshFavorites)}
                      showAddToCart
                    >
                      <HStack mt={2} spacing={2}>
                        <Text fontSize="sm" fontWeight="semibold">${product.priceMin}</Text>
                        <Box flex={1} />
                        <Box
                          as="button"
                          onClick={() => moveToCart(product)}
                          style={{ color: "#319795", fontWeight: "bold" }}
                        >
                          Mover al carrito
                        </Box>
                      </HStack>
                    </ProductComponent>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          {/* RESUMEN LATERAL */}
          {favorites && favorites.length > 0 && (
            <Box w="280px" p={4} bg="gray.50" _dark={{ bg: "gray.800" }} rounded="md" shadow="sm">
              <Heading size="md" mb={2}>Resumen</Heading>
              <Divider mb={2} />
              <Text mb={1}>Productos: {favorites.length}</Text>
              <Text mb={1}>Subtotal: ${subtotal}</Text>
            </Box>
          )}
        </HStack>
      </Container>
    </Box>
  );
}
