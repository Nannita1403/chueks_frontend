// src/pages/User/Home/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { Box, Container, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import ApiService from "../../../reducers/api/Api.jsx";
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";
import ProductModal from "../../../components/ProductModal/ProductModal.jsx";
import AppHeader from "../../../components/Header/AppHeader.jsx";
import InfiniteCarousel from "../../../components/Carousel/InfiniteCarousel.jsx";
import CategoriesGrid from "../../../components/Category/CategoriesGrid.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const { user, cartItems, favorites, refreshCart, toggleFavorite } = useAuth();
  const muted = useColorModeValue("gray.600", "gray.400");

  // 📌 Categorías
  const categories = useMemo(
    () => [
      { id: "mochilas", name: "Mochilas", color: "pink.400" },
      { id: "carteras", name: "Carteras", color: "cyan.400" },
      { id: "riñoneras", name: "Riñoneras", color: "yellow.400" },
      { id: "bolsos", name: "Bolsos", color: "green.400" },
      { id: "accesorios", name: "Accesorios", color: "red.400" },
      { id: "neceseres", name: "Neceser", color: "purple.400" },
    ],
    []
  );

  // 📌 Normalización de productos
  const normalize = (p) => ({
    ...p,
    imgPrimary:
      p?.imgPrimary?.url ||
      p?.imgPrimary ||
      (Array.isArray(p?.images) ? p.images[0] : p?.image) ||
      "/placeholder.svg",
    priceMin: p?.priceMin ?? p?.price ?? 0,
  });

  // 📌 Cargar productos
  useEffect(() => {
    (async () => {
      try {
        const resp = await ApiService.get("/products");
        const list = Array.isArray(resp) ? resp : resp?.products || resp?.data || [];
        setProducts(list.map((p) => normalize(p)));
      } catch (error) {
        console.error("❌ Error cargando productos en Home:", error);
        toast({ title: "Error cargando productos", status: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 📌 Selección de destacados
  const featuredCodes = ["RI002", "BOL002", "BOL008A", "MO004", "NEC002", "TAR002"];
  const featuredProducts = useMemo(() => {
    const arr = Array.isArray(products) ? products : [];
    const featured = arr.filter((p) => featuredCodes.includes(p.code));
    return featured.length ? featured : arr.slice(0, 9);
  }, [products]);

  // 📌 Abrir detalle
  const openDetail = (p) => setSelectedProduct(p);

  // 📌 Agregar al carrito
  const addToCartHandler = async (product, qty, color) => {
    try {
      await ApiService.post("/cart/add", {
        productId: product._id,
        quantity: qty,
        color: color?.name,
      });
      await refreshCart();
      toast({ title: `${qty} ${product.name} agregados al carrito`, status: "success" });
    } catch (e) {
      console.error("❌ Error al agregar al carrito:", e);
      toast({ title: "No se pudo agregar al carrito", status: "error" });
    }
  };

  // 📌 Loader
  if (loading) {
    return (
      <Box maxW="container.xl" mx="auto" px={4} py={8}>
        <Spinner />
        <Text ml={2} color={muted} display="inline-block">
          Cargando productos…
        </Text>
      </Box>
    );
  }

  // 📌 Render principal
  return (
    <Box minH="100vh">
      <AppHeader
        wishlistCount={favorites?.length || 0}
        cartCount={cartItems?.length || 0}
      />

      <Container maxW="container.xl" py={8}>
        <CategoriesGrid categories={categories} />

        <Box mt={12} mb={8}>
          <InfiniteCarousel
            title="NUEVA TEMPORADA"
            items={featuredProducts}
            gap={16}
            autoPlay={true}
            renderItem={(product) => (
              <ProductComponent
              product={product}
              onViewDetail={() => openDetail(product)}
              onToggleLike={() => toggleFavorite(product._id)}
              isFavorite={favorites.some((f) => f._id === product._id)}
            />
            )}
          />
        </Box>
      </Container>

      <ProductModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        products={products}
        setProducts={setProducts}
        addToCartHandler={addToCartHandler}
      />
    </Box>
  );
}
