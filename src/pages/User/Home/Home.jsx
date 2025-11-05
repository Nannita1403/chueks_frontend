import { useEffect, useMemo, useState } from "react";
import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import ApiService from "../../../reducers/api/Api.jsx";
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";
import ProductModal from "../../../components/ProductModal/ProductModal.jsx";
import AppHeader from "../../../components/Header/AppHeader.jsx";
import InfiniteCarousel from "../../../components/Carousel/InfiniteCarousel.jsx";
import CategoriesGrid from "../../../components/Category/CategoriesGrid.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import { ProductCardSkeleton } from "../../../components/Loading-Skeleton/loading-skeleton.jsx"
import Loading from "../../../components/Loading/Loading.jsx";


export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const { user, cartItems, favorites, refreshCart, toggleFavorite } = useAuth();
  const muted = useColorModeValue("gray.600", "gray.400");

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

  const normalize = (product) => ({
    ...product,
    imgPrimary:
      product?.imgPrimary?.url ||
      product?.imgPrimary ||
      (Array.isArray(product?.images) ? product.images[0] : product?.image) ||
      "/placeholder.svg",
    priceMin: product?.priceMin ?? product?.price ?? 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const resp = await ApiService.get("/products");
        const list = Array.isArray(resp) ? resp : resp?.products || resp?.data || [];
        setProducts(list.map((products) => normalize(products)));
      } catch (error) {
        console.error("❌ Error cargando productos en Home:", error);
        toast({ title: "Error cargando productos", status: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featuredCodes = ["RI002", "BOL002", "BOL008A", "MO004", "NEC002", "TAR002"];
  const featuredProducts = useMemo(() => {
    const arr = Array.isArray(products) ? products : [];
    const featured = arr.filter((product) => featuredCodes.includes(product.code));
    return featured.length ? featured : arr.slice(0, 9);
  }, [products]);

  const openDetail = (p) => setSelectedProduct(p);

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

  if (loading) {
  return <Loading />;
}

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
              isFavorite={favorites?.some((f) => f._id === product._id)}
            />
            )}
          />
          {!featuredProducts?.length && !loading && (
            <Box display="flex" gap={4} justifyContent="center" mt={4}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Box key={i} w="250px">
                  <ProductCardSkeleton />
                </Box>
              ))}
            </Box>
          )}
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
