import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box, Heading, SimpleGrid, Text, Spinner, HStack, VStack, Image, IconButton, Container, Tooltip, Divider, Grid, GridItem
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

import { useAuth } from "../../../context/Auth/auth.context.jsx";
import ProductModal from "../../../components/ProductModal/ProductModal.jsx";
import AppHeader from "../../../components/Header/AppHeader.jsx";
import BackButton from "../../../components/Nav/BackButton.jsx";
import CustomButton from "../../../components/Button/Button.jsx";
import ApiService from "../../../reducers/api/Api.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import { toggleFavorite } from "../../../components/ToggleFavorite/ToggleFavorite.jsx";

const money = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export default function Favorites() {
  const { user, favorites, refreshFavorites } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { toast } = useToast();

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const panelBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.300");
  const muted = useColorModeValue("gray.600", "gray.400");
  const headerBg = useColorModeValue("pink.500", "pink.400");

  // --- Cargar favoritos ---
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

  // --- Mover favorito al carrito ---
  const moveToCart = async (product) => {
    try {
      await ApiService.post("/cart/add", { productId: product._id, quantity: 1 });
      await toggleFavorite(product._id, toast, refreshFavorites);
      toast({ title: `${product.name} agregado al carrito`, status: "success" });
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  // --- Mover todos los favoritos al carrito ---
  const moveAllToCart = async () => {
    try {
      for (const product of favorites) {
        await ApiService.post("/cart/add", { productId: product._id, quantity: 1 });
        await toggleFavorite(product._id, toast, refreshFavorites);
      }
      toast({ title: `Todos los productos agregados al carrito`, status: "success" });
    } catch (err) {
      toast({ title: "Error al mover todos los favoritos", description: err.message, status: "error" });
    }
  };

  // --- Modal producto ---
  const openProductDetail = async (productId) => {
    try {
      const res = await ApiService.get(`/products/${productId}`);
      setSelected(res?.product || res);
    } catch {
      toast({ title: "No se pudo abrir el producto", status: "error" });
    }
  };

  // --- Calcular subtotal ---
  const subtotal = useMemo(() => {
    return favorites?.reduce((acc, p) => acc + (p.priceMin || 0), 0) || 0;
  }, [favorites]);

  if (!user) {
    return (
      <Box minH="100vh" bg={pageBg} p={6} textAlign="center">
        <AppHeader />
        <BackButton mb={4} />
        <Text>Debes iniciar sesión para ver tus favoritos.</Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box minH="100vh" bg={pageBg} p={6} textAlign="center">
        <AppHeader />
        <BackButton mb={4} />
        <Spinner />
        <Text mt={2}>Cargando tus favoritos…</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg}>
      <AppHeader />
      <Box bg={headerBg} color="white" py={3}>
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <BackButton color="white" variant="link" />
            <Text fontWeight="bold" fontSize="xl">Mis Favoritos ❤️</Text>
            <Box w="88px" />
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={6}>
        {(!favorites || favorites.length === 0) ? (
          <Box bg={panelBg} borderWidth={1} borderColor={borderColor} rounded="md" py={10} textAlign="center">
            <Text color={muted}>No tienes productos en favoritos</Text>
          </Box>
        ) : (
          <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap={4}>
            {/* LISTA FAVORITOS */}
            <GridItem>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {favorites.map((product) => (
                  <Box key={product._id} bg={panelBg} borderWidth={1} borderColor={borderColor} rounded="md" overflow="hidden">
                    <VStack align="stretch" spacing={2}>
                      <Box
                        h="200px"
                        bg={useColorModeValue("gray.100", "whiteAlpha.100")}
                        overflow="hidden"
                        cursor="pointer"
                        onClick={() => openProductDetail(product._id)}
                      >
                        <Image
                          src={product.imgPrimary}
                          alt={product.name}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                      </Box>

                      <Box p={3}>
                        <HStack justify="space-between">
                          <Box>
                            <Text fontWeight="semibold" noOfLines={1}>{product.name}</Text>
                            {product.colors?.[0]?.name && (
                              <Text fontSize="sm" color={muted}>Color: {product.colors[0].name[0]}</Text>
                            )}
                            <Text fontSize="sm" color={muted}>Precio: {money(product.priceMin)}</Text>
                          </Box>

                          <IconButton
                            aria-label="Eliminar favorito"
                            icon={<CloseIcon />}
                            size="sm"
                            variant="ghost"
                            color={muted}
                            onClick={() => toggleFavorite(product._id, toast, refreshFavorites)}
                          />
                        </HStack>

                        <CustomButton
                          mt={2}
                          size="sm"
                          w="full"
                          onClick={() => moveToCart(product)}
                        >
                          Mover al carrito
                        </CustomButton>
                      </Box>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </GridItem>

            {/* RESUMEN LATERAL */}
            <GridItem>
              <Box bg={panelBg} borderWidth={1} borderColor={borderColor} rounded="md" p={4} position="sticky" top={4}>
                <Heading size="md" mb={2}>Resumen</Heading>
                <Divider mb={3} />
                <HStack justify="space-between">
                  <Text>Subtotal</Text>
                  <Text fontWeight="semibold">{money(subtotal)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Envío</Text>
                  <Text fontWeight="semibold">Gratis</Text>
                </HStack>
                <Divider my={3} />
                <HStack justify="space-between">
                  <Text>Total</Text>
                  <Text fontWeight="bold">{money(subtotal)}</Text>
                </HStack>

                <CustomButton mt={4} w="full" onClick={moveAllToCart}>
                  Mover todos al carrito
                </CustomButton>
              </Box>
            </GridItem>
          </Grid>
        )}
      </Container>

      {selected && (
        <ProductModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          product={selected}
          products={[]} setProducts={() => {}}
          addToCartHandler={async (product, qty, color) => {
            await ApiService.post("/cart/add", { productId: product._id, quantity: qty, color: color?.name });
            toast({ title: `Agregado ${qty} al carrito`, status: "success" });
            await refreshFavorites?.();
          }}
        />
      )}
    </Box>
  );
}
