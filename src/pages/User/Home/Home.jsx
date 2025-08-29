import { useEffect, useMemo, useState } from "react";
import { Box, Container, Heading, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import ApiService from "../../../reducers/api/Api.jsx";
import { toggleLike } from "../../../reducers/products/toggleLike.jsx";
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
  const { user, token, cartItems, wishlistItems } = useAuth();
  const { refreshCart } = useAuth();
  const muted = useColorModeValue("gray.600", "gray.400");

  // 6 categorías (ajusta IDs a tus rutas reales)
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

  const normalize = (p) => ({
    ...p,
    imgPrimary:
      p?.imgPrimary?.url ||
      p?.imgPrimary ||
      (Array.isArray(p?.images) ? p.images[0] : p?.image) ||
      "/placeholder.svg",
    priceMin: p?.priceMin ?? p?.price ?? 0,
  });

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
  }, [toast]);

  const featuredCodes = ["RI002", "BOL002", "BOL008A", "MO004", "NEC002", "TAR002"];
  const featuredProducts = useMemo(() => {
    const arr = Array.isArray(products) ? products : [];
    const featured = arr.filter((p) => featuredCodes.includes(p.code));
    return featured.length ? featured : arr.slice(0, 9);
  }, [products]);

  const handleToggleLike = async (productId, addLike) => {
    if (!user) {
      toast({ title: "Debes iniciar sesión para dar like", status: "warning" });
      return;
    }
    try {
      await toggleLike(productId, addLike, products, setProducts);
      if (selectedProduct && selectedProduct._id === productId) {
        const liked = addLike;
        setSelectedProduct((prev) =>
          !prev
            ? prev
            : {
                ...prev,
                likes: liked
                  ? [...(prev.likes || []), user.id]
                  : (prev.likes || []).filter((id) => id !== user.id),
              }
        );
      }
      toast({
        title: addLike ? "Producto marcado como favorito" : "Producto removido de favoritos",
        status: "success",
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({ title: "Error al actualizar like", status: "error" });
    }
  };

  const openDetail = (p) => setSelectedProduct(p);

  const addToCartHandler = async (product, qty, color) => {
  try {
    await ApiService.post("/cart/add", {
      productId: product._id,
      quantity: qty,
      color: color?.name,
    });
    await refreshCart?.(); // 🔁 actualiza badge del header
    toast({ title: `${qty} ${product.name} agregados al carrito`, status: "success" });
  } catch (e) {
    console.error(e);
    toast({ title: "No se pudo agregar al carrito", status: "error" });
  }
};

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

  return (
    <Box minH="100vh">
      {/* Menú superior */}
      <AppHeader
        wishlistCount={wishlistItems?.length || 0}
        cartCount={cartItems?.length || 0}
      />

      {/* Contenido */}
      <Container maxW="container.xl" py={8}>
        {/* Carrusel de Nueva Temporada */}
        <Box mb={12}>
          <InfiniteCarousel
            title="NUEVA TEMPORADA"
            items={featuredProducts}
            gap={16}
            autoPlay={false}
            renderItem={(product) => (
              <ProductComponent
                product={product}
                onViewDetail={() => openDetail(product)}
                onToggleLike={(liked) => handleToggleLike(product._id, liked)}
              />
            )}
          />
        </Box>

        {/* Categorías (6) */}
        <CategoriesGrid categories={categories} />
      </Container>

      {/* Modal ver detalle */}
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