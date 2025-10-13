// src/pages/User/Wishlist/Favorites.jsx
import { useEffect, useState, useMemo } from "react";
import {Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Divider, Spinner } from "@chakra-ui/react";
import AppHeader from "../../../components/Header/AppHeader.jsx";
import BackButton from "../../../components/Nav/BackButton.jsx";
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";
import ProductModal from "../../../components/ProductModal/ProductModal.jsx";
import { ProductCardSkeleton } from "../../../components/Loading-Skeleton/loading-skeleton.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";

export default function Favorites() {
  const { user, favorites, toggleFavorite } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(false); 
    }, [user]);

  const subtotal = useMemo(() => {
    return (favorites || []).reduce((acc, p) => acc + (p.priceMin || 0), 0);
  }, [favorites]);

  const moveToCart = async (product) => {
    try {
      const ApiService = (await import("../../../reducers/api/Api.jsx")).default;
      await ApiService.post("/cart/add", { productId: product._id, quantity: 1 });
      await toggleFavorite(product._id);
    } catch (err) {
      console.error("Error al mover al carrito:", err);
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
                <Text color="gray.600" _dark={{ color: "gray.400" }}>
                  No tienes productos en favoritos
                </Text>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                {favorites.map((product) => (
                  <Box key={product._id}>
                    <ProductModal
                      isOpen={!!selectedProduct && selectedProduct._id === product._id}
                      onClose={() => setSelectedProduct(null)}
                      product={selectedProduct || product}
                      addToCartHandler={moveToCart}
                    />

                    <ProductComponent
                      product={product}
                      isFavorite
                      onViewDetail={() => setSelectedProduct(product)}
                      onToggleLike={() => toggleFavorite(product._id)}
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

          {favorites && favorites.length > 0 && (
          <>
            <Box
              display={{ base: "block", lg: "none" }}
              position="sticky"
              top="0"
              zIndex="10"
              bg="pink.500"
              color="white"
              shadow="md"
            >
              <Box px={4} py={2} cursor="pointer" _hover={{ bg: "pink.600" }}>
                <Text fontWeight="bold">Resumen ▾</Text>
              </Box>
              <Box px={4} py={2} bg="white" color="gray.800" display="none" _groupHover={{ display: "block" }}>
                <Text mb={1}>Productos: {favorites.length}</Text>
                <Text mb={1}>Subtotal: ${subtotal}</Text>
              </Box>
            </Box>
            <Box
              display={{ base: "none", lg: "block" }}
              w="280px"
              p={4}
              bg="gray.50"
              _dark={{ bg: "gray.800" }}
              rounded="md"
              shadow="sm"
            >
              <Heading size="md" mb={2}>Resumen</Heading>
              <Divider mb={2} />
              <Text mb={1}>Productos: {favorites.length}</Text>
              <Text mb={1}>Subtotal: ${subtotal}</Text>
            </Box>
          </>
        )}
        </HStack>
      </Container>
    </Box>
  );
}
