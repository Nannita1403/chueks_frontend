import { useEffect, useState, useMemo } from "react";
import {Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Divider, useColorModeValue, } from "@chakra-ui/react";
import AppHeader from "../../../components/Header/AppHeader.jsx";
import BackButton from "../../../components/Nav/BackButton.jsx";
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";
import ProductModal from "../../../components/ProductModal/ProductModal.jsx";
import { ProductCardSkeleton } from "../../../components/Loading-Skeleton/loading-skeleton.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";

export default function Favorites() {
  const { user, favorites, toggleFavorite } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(false); 
    }, [user]);

  const subtotal = useMemo(() => {
    return (favorites || []).reduce((acc, product) => acc + (product.priceMin || 0), 0);
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
      <Box minH="100vh" p={6} bg={bg}>
        <AppHeader />
        <BackButton mb={4} />
        <VStack spacing={4} pt={10}>
          <Text fontSize="lg" color="gray.600">
            Debes iniciar sesión para ver tus favoritos 💔
          </Text>
        </VStack>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box minH="100vh" bg={bg}>
        <AppHeader />
        <Container maxW="container.xl" py={6}>
          <BackButton mb={4} />
          <VStack spacing={6}>
            <Loading text="Cargando tus favoritos..." />
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bg}>
      <AppHeader />

      <Box bg="pink.500" color="white" py={3}>
        <Container maxW="container.xl">
          <BackButton color="white" variant="link" />
        </Container>
      </Box>

      <Container maxW="container.xl" py={6}>
        <HStack align="start" spacing={6} w="full">
          <Box flex={1}>
            <Heading size="lg" mb={6}>
              Mis Favoritos ❤️
            </Heading>

            {!favorites || favorites.length === 0 ? (
              <Box
                bg={cardBg}
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
                      onToggleLike={async () => {
                        await toggleFavorite(product._id);
                        setSelectedProduct(null); 
                      }}
                      showAddToCart
                    >
                      <HStack mt={2} spacing={2}>
                        <Text fontSize="sm" fontWeight="semibold">
                          ${product.priceMin}
                        </Text>
                        <Box flex={1} />
                        <Box
                          as="button"
                          onClick={() => moveToCart(product)}
                          color="teal.500"
                          fontWeight="bold"
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
            <Box
              display={{ base: "none", lg: "block" }}
              w="280px"
              p={4}
              bg={cardBg}
              rounded="md"
              shadow="sm"
            >
              <Heading size="md" mb={2}>
                Resumen
              </Heading>
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
