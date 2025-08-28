// src/pages/Category/CategoryPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Container, HStack, SimpleGrid, Spinner, Text, Button, Select,
  useColorModeValue, Icon
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";

import ApiService from "../../../reducers/api/Api.jsx";
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";
import ProductModal from "../../../components/ProductModal/ProductModal.jsx";
import CategoryFiltersDrawer from "../../../components/Category/CategoryFiltersDrawer.jsx";
import { toggleLike } from "../../../reducers/products/toggleLike.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";

/* ---------- helpers ---------- */
const normalize = (p) => ({
  ...p,
  imgPrimary:
    p?.imgPrimary?.url ||
    p?.imgPrimary ||
    (Array.isArray(p?.images) ? p.images[0] : p?.image) ||
    "/placeholder.svg",
  priceMin: p?.priceMin ?? p?.price ?? 0,
});

const removeAccents = (s = "") => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const titleCase = (s = "") => s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const slugToEnum = {
  mochilas:  "Mochila",
  carteras:  "Cartera",
  "riñoneras":"Riñonera",
  rinoneras: "Riñonera",
  bolsos:    "Bolso",
  accesorios:"Accesorios",
  neceseres: "Neceser",
};

const normalizeList = (resp) => (Array.isArray(resp) ? resp : resp?.products || resp?.data || []);

// match por categoría cuando p.category es array
const categoryMatches = (product, target) => {
  const cats = Array.isArray(product.category)
    ? product.category
    : product.category ? [product.category] : [];
  return cats.some((c) => removeAccents(String(c)).toLowerCase() === target);
};

/* ---------- page ---------- */
export default function CategoryPage() {
  const { id } = useParams(); // slug
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({ colors: [], styles: [] });
  const [sortBy, setSortBy] = useState("recent"); // recent | price_asc | price_desc
  const [selected, setSelected] = useState(null);

  const muted = useColorModeValue("gray.600", "gray.400");
  const bannerBg = useColorModeValue("pink.500", "pink.400");

  const enumCategory = useMemo(() => slugToEnum[(id || "").toLowerCase()] || id, [id]);
  const bannerTitle = useMemo(() => titleCase(enumCategory), [enumCategory]);

  // Opciones de filtros derivadas de los productos (por si /meta está vacío)
  const filterOptions = useMemo(() => {
    const colors = new Set();
    const styles = new Set();
    for (const p of products) {
      // colors: [{ name: string[] }]
      if (Array.isArray(p.colors)) {
        p.colors.forEach((c) => {
          const arr = Array.isArray(c?.name) ? c.name : (c?.name ? [c.name] : []);
          arr.forEach((n) => n && colors.add(n));
        });
      }
      // style: string | string[]
      const st = Array.isArray(p.style) ? p.style : (p.style ? [p.style] : []);
      st.forEach((s) => s && styles.add(s));
    }
    return { colorOptions: Array.from(colors), styleOptions: Array.from(styles) };
  }, [products]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 1) intento directo con enum singular (con ñ)
        let resp = await ApiService.get(`/products?category=${encodeURIComponent(enumCategory)}`);
        let list = normalizeList(resp);

        // 2) si vacío y tiene ñ, prueba con n
        if (!list.length && /ñ/i.test(enumCategory)) {
          const alt = enumCategory.replace(/ñ/gi, "n");
          resp = await ApiService.get(`/products?category=${encodeURIComponent(alt)}`);
          list = normalizeList(resp);
        }

        // 3) si sigue vacío → carga todo y filtra cliente ignorando acentos
        if (!list.length) {
          const allResp = await ApiService.get("/products");
          const all = normalizeList(allResp);
          const target = removeAccents(enumCategory).toLowerCase();
          list = all.filter((p) => categoryMatches(p, target));
        }

        // Normaliza
        let normalized = list.map(normalize);

        // Aplica filtros locales
        if (filters.colors.length) {
          const setColors = new Set(filters.colors);
          normalized = normalized.filter((p) =>
            Array.isArray(p.colors) &&
            p.colors.some((c) => {
              const arr = Array.isArray(c?.name) ? c.name : (c?.name ? [c.name] : []);
              return arr.some((n) => setColors.has(n));
            })
          );
        }
        if (filters.styles.length) {
          const setStyles = new Set(filters.styles);
          normalized = normalized.filter((p) => {
            const st = Array.isArray(p.style) ? p.style : (p.style ? [p.style] : []);
            return st.some((s) => setStyles.has(s));
          });
        }

        // Orden local
        if (sortBy === "price_asc")  normalized.sort((a, b) => (a.priceMin || 0) - (b.priceMin || 0));
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
  }, [enumCategory, filters, sortBy, toast]);

  // Likes
  const handleToggleLike = async (productId, addLike) => {
    if (!user) return toast({ title: "Debes iniciar sesión para dar like", status: "warning" });
    try {
      await toggleLike(productId, addLike, products, setProducts);
      if (selected && selected._id === productId) {
        setSelected((prev) =>
          !prev ? prev : {
            ...prev,
            likes: addLike
              ? [...(prev.likes || []), user.id]
              : (prev.likes || []).filter((id) => id !== user.id),
          }
        );
      }
    } catch {
      toast({ title: "Error al actualizar like", status: "error" });
    }
  };

  // Add to cart desde modal
  const addToCartHandler = async (product, qty, color) => {
    try {
      await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
        body: JSON.stringify({ productId: product._id, quantity: qty, color: color?.name }),
      });
      toast({ title: `Agregado ${qty} al carrito`, status: "success" });
    } catch {
      toast({ title: "No se pudo agregar al carrito", status: "error" });
    }
  };

  if (loading) {
    return (
      <Box maxW="container.xl" mx="auto" px={4} py={8}>
        <Spinner />
        <Text ml={2} color={useColorModeValue("gray.600","gray.400")} display="inline-block">Cargando productos…</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Banner título */}
      <Box bg={bannerBg} color="white" py={3} textAlign="center" fontWeight="bold" fontSize="xl">
        {titleCase(enumCategory)}
      </Box>

      <Container maxW="container.xl" py={6}>
        {/* Controles */}
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

        {/* Grid productos */}
        {products.length === 0 ? (
          <Box py={16} textAlign="center">
            <Text>No hay productos en esta categoría</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            {products.map((p) => (
              <ProductComponent
                key={p._id}
                product={p}
                onViewDetail={() => setSelected(p)}
                onToggleLike={(liked) => handleToggleLike(p._id, liked)}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>

      {/* Drawer filtros */}
      <CategoryFiltersDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        value={filters}
        onChange={setFilters}
        options={filterOptions}
      />

      {/* Modal detalle */}
      <ProductModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        product={selected}
        products={products}
        setProducts={setProducts}
        addToCartHandler={addToCartHandler}
      />
    </Box>
  );
}
