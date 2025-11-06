import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, HStack, SimpleGrid, Spinner, Text, Button, Select,
  useColorModeValue, Icon, Wrap, WrapItem } from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import ApiService from "../../../reducers/api/Api.jsx";
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";
import ProductModal from "../../../components/ProductModal/ProductModal.jsx";
import CategoryFiltersDrawer from "../../../components/Category/CategoryFiltersDrawer.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import AppHeader from "../../../components/Header/AppHeader.jsx";
import BackButton from "../../../components/Nav/BackButton.jsx";
import { ProductCardSkeleton } from "../../../components/Loading-Skeleton/loading-skeleton.jsx"
import CategorySEO from "../../../components/SEO/CategorySEO.jsx";


const normalize = (product) => ({
  ...product,
  imgPrimary: product?.imgPrimary?.url || product?.imgPrimary || (Array.isArray(product?.images) ? product.images[0] : product?.image) || "/placeholder.svg",
  priceMin: product?.priceMin ?? product?.price ?? 0,
});

const removeAccents = (s = "") => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const titleCase = (s = "") => s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const slugToEnum = {
  mochilas: "Mochila",
  carteras: "Cartera",
  riñoneras: "Riñonera",
  bolsos: "Bolso",
  accesorios: "Accesorios",
  neceseres: "Neceser",
};
const normalizeList = (respuesta) => (Array.isArray(respuesta) ? respuesta : respuesta?.products || respuesta?.data || []);
const categoryMatches = (product, target) => {
  const cats = Array.isArray(product.category) ? product.category : product.category ? [product.category] : [];
  return cats.some((c) => removeAccents(String(c)).toLowerCase() === target);
};

const categoryColors = ["pink.400", "teal.400", "blue.400", "orange.400", "purple.400", "green.400"];

const filterOptions = {
  colors: ["lila","verde","animal print","suela","nude","blanca","beige","gris","negro tramado","rose gold",
           "negro","glitter dorada","dorada","borgoña","naranja","amarillo","habano","cobre","peltre",
           "crema","celeste","plateada","rosa","rojo","burdeos","vison","verde oliva","cristal",
           "negro opaco","negro croco","negro con crudo","turquesa"],
  styles: ["Urbana","Fiesta","Noche","Casual","Diario","Ejecutivo","Trabajo","Viaje","Playa","Deporte"],
  material: ["cuero","tela Andorra","simil cuero","símil cuero","sublimado CHUEKS","tela puffer","cinta sublimada",
             "metálico","resina","plastico","tela","iman","tafeta negra","grabado laser",
             "simil cuero rigido","neoprene","nylon","sublimda","tela impermeable"]
};

export default function CategoryPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user, toggleFavorite, refreshCart } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({ colors: [], styles: [] });
  const [sortBy, setSortBy] = useState("recent");
  const [selected, setSelected] = useState(null);

  const muted = useColorModeValue("gray.600", "gray.400");
  const bannerBg = useColorModeValue("pink.500", "pink.400");

  const enumCategory = useMemo(() => id === "all" || !id ? null : slugToEnum[id.toLowerCase()] || id, [id]);
  const bannerTitle = useMemo(() => enumCategory ? titleCase(enumCategory) : "Todos los productos", [enumCategory]);

  const allCategories = Object.values(slugToEnum);
  const categoryButtons = allCategories.filter((c) => c !== enumCategory);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let list = [];
        if (!enumCategory) {
          const resp = await ApiService.get("/products");
          list = normalizeList(resp);
        } else {
          let resp = await ApiService.get(`/products?category=${encodeURIComponent(enumCategory)}`);
          list = normalizeList(resp);
          if (!list.length && /ñ/i.test(enumCategory)) {
            const alt = enumCategory.replace(/ñ/gi, "n");
            resp = await ApiService.get(`/products?category=${encodeURIComponent(alt)}`);
            list = normalizeList(resp);
          }
          if (!list.length) {
            const allResp = await ApiService.get("/products");
            const all = normalizeList(allResp);
            const target = removeAccents(enumCategory).toLowerCase();
            list = all.filter((p) => categoryMatches(p, target));
          }
        }

        let normalized = list.map(normalize);

        if (filters.colors.length) {
          const setColors = new Set(filters.colors);
          normalized = normalized.filter((product) =>
            Array.isArray(product.colors) &&
            product.colors.some((color) => {
              const arr = Array.isArray(color?.name) ? color.name : color?.name ? [color.name] : [];
              return arr.some((n) => setColors.has(n));
            })
          );
        }
        if (filters.styles.length) {
          const setStyles = new Set(filters.styles);
          normalized = normalized.filter((product) => {
            const styles = Array.isArray(product.style) ? product.style : product.style ? [product.style] : [];
            return styles.some((s) => setStyles.has(s));
          });
        }
        if (sortBy === "price_asc") normalized.sort((a, b) => (a.priceMin || 0) - (b.priceMin || 0));
        if (sortBy === "price_desc") normalized.sort((a, b) => (b.priceMin || 0) - (a.priceMin || 0));

        setProducts(normalized);
      } catch (err) {
        console.error("Error cargando productos:", err);
        toast({ title: "No se pudieron cargar los productos", status: "error" });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [enumCategory, filters, sortBy]);

  const handleToggleFavorite = async (productId) => {
    if (!user) return toast({ title: "Debes iniciar sesión para agregar favoritos", status: "warning" });
    try {
      await toggleFavorite(productId);
      setProducts((prev) =>
        prev.map((product) => (product._id === productId ? { ...product, isFavorite: !product.isFavorite } : product))
      );
    } catch {
      toast({ title: "Error al actualizar favoritos", status: "error" });
    }
  };

  const addToCartHandler = async (product, qty, color) => {
    const payload = { productId: product._id, quantity: qty, color: color?.name };
    try {
      await ApiService.post("/cart/add", payload);
      await refreshCart?.();
      toast({ title: `Agregado ${qty} al carrito`, status: "success" });
    } catch (e) {
      console.warn("POST /cart/add falló; guardo en localStorage. Detalle:", e);
      const key = "cart";
      const curr = (() => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } })();
      const idx = curr.findIndex((i) => i.productId === payload.productId && i.color === payload.color);
      if (idx >= 0) curr[idx].quantity += payload.quantity; else curr.push(payload);
      localStorage.setItem(key, JSON.stringify(curr));
      toast({ title: `Agregado ${qty} al carrito (local)`, status: "success" });
    }
  };

  if (loading) 
    return (
    <Box maxW="container.xl" mx="auto" px={4} py={8}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </SimpleGrid>
    </Box>
  );

  return (
    <>
    <CategorySEO category={enumCategory || "Productos"} products={products} />
    <Box minH="100vh">
      <AppHeader />
      <Box bg={bannerBg} color="white" py={3}>
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <BackButton />
            <Text fontWeight="bold" fontSize="xl">{bannerTitle}</Text>
            <Box w="88px" />
          </HStack>
        </Container>
      </Box>
      <Container maxW="container.xl" py={4}>
        <Wrap spacing={2} justify="center">
          <WrapItem>
            <Button
              size="sm"
              bg="gray.300"
              _hover={{ bg: "gray.400" }}
              onClick={() => navigate("/products")}
            >
              Todos
            </Button>
          </WrapItem>
          {categoryButtons.map((cat, idx) => (
            <WrapItem key={cat}>
              <Button
                size="sm"
                bg={categoryColors[idx % categoryColors.length]}
                color="white"
                _hover={{ opacity: 0.8 }}
                onClick={() => navigate(`/category/${cat.toLowerCase()}`)}
              >
                {cat}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </Container>
      <Container maxW="container.xl" py={6}>
        <HStack justify="space-between" mb={4}>
          <Button leftIcon={<Icon as={FiFilter} />} variant="outline" onClick={() => setDrawerOpen(true)}>
            Filtrar
          </Button>
          <HStack>
            <Text color={muted} fontSize="sm">Ordenar por:</Text>
            <Select size="sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} w="180px">
              <option value="recent">Más recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </Select>
          </HStack>
        </HStack>
        {products.length === 0 ? (
          <Box py={16} textAlign="center">
            <Text>No hay productos disponibles</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            {products.map((product) => (
              <ProductComponent
                key={product._id}
                product={product}
                onViewDetail={() => setSelected(product)}
                onToggleLike={() => handleToggleFavorite(product._id)}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>
      <CategoryFiltersDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        value={filters}
        onChange={setFilters}
        options={filterOptions}
      />

      <ProductModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        product={selected}
        products={products}
        setProducts={setProducts}
        addToCartHandler={addToCartHandler}
      />
    </Box>
    </>
  );
}
