import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  IconButton,
  Badge,
  Grid,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu } from "react-icons/fi";

import ProductsActions from "../../../reducers/products/products.actions.jsx";
import { toggleLike } from "../../../reducers/products/toggleLike.jsx";
import ProductComponent from "../../../components/Product/Product.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useIsMobile } from "../../../Hooks/useMobile.jsx"; 
import { useToast } from "../../../Hooks/useToast.jsx";

const Home = () => {
  const [products, setProducts] = useState([]); // siempre empieza en []
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { isMobile } = useIsMobile();
  const { toast } = useToast();
  const { user, cartItems, wishlistItems } = useAuth();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await ProductsActions.getProducts();

        // 👇 si el backend devuelve objeto {products: [...]}, normalízalo
        const normalized =
          Array.isArray(productsData) ? productsData : productsData?.products || [];

        setProducts(normalized);
      } catch (error) {
        console.error("❌ Error cargando productos en Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  // ✅ proteger: solo si es array
  const safeProducts = Array.isArray(products) ? products : [];
  const featuredProducts = safeProducts.slice(0, 6);

  // Función para manejar like en Home
const handleToggleLike = async (productId, liked) => {
  if (!user) {
    toast({ title: "Debes iniciar sesión para dar like", status: "warning" });
    return;
  }

  try {
    await toggleLike(productId, liked, products, setProducts);

    toast({
      title: liked ? "Producto marcado como favorito" : "Producto removido de favoritos",
      status: "success",
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    toast({ title: "Error al actualizar like", status: "error" });
  }
};


  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box
        position="sticky"
        top={0}
        zIndex={50}
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Container maxW="container.xl" py={3}>
          <Flex align="center" justify="space-between">
            <HStack spacing={4}>
              {isMobile && (
                <IconButton
                  aria-label="Menu"
                  icon={<FiMenu />}
                  variant="ghost"
                  onClick={() => setDrawerOpen(true)}
                />
              )}
              <Link to="/">
                <Image
                  src="/logo-chueks.png"
                  alt="CHUEKS Logo"
                  width={120}
                  height={40}
                />
              </Link>
            </HStack>

            {!isMobile && (
              <Box flex={1} maxW="md" mx={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="gray" />
                  </InputLeftElement>
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </Box>
            )}

            <HStack spacing={2}>
              {isMobile && (
                <Link to="/search">
                  <IconButton
                    aria-label="Search"
                    icon={<FiSearch />}
                    variant="ghost"
                  />
                </Link>
              )}
              <Link to="/wishlist">
                <Box position="relative">
                  <IconButton
                    aria-label="Wishlist"
                    icon={<FiHeart />}
                    variant="ghost"
                  />
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme="pink"
                    borderRadius="full"
                    fontSize="xs"
                    minW={5}
                    h={5}
                  >
                    {wishlistItems?.length || 0}
                  </Badge>
                </Box>
              </Link>
              <Link to="/cart">
                <Box position="relative">
                  <IconButton
                    aria-label="Cart"
                    icon={<FiShoppingBag />}
                    variant="ghost"
                  />
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme="pink"
                    borderRadius="full"
                    fontSize="xs"
                    minW={5}
                    h={5}
                  >
                    {cartItems?.length || 0}
                  </Badge>
                </Box>
              </Link>
              <Link to="/profile">
                <IconButton
                  aria-label="Profile"
                  icon={<FiUser />}
                  variant="ghost"
                />
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Drawer para móvil */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Categorías</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              {categories.map((category) => (
                <Link key={category._id} to={`/category/${category._id}`}>
                  <Text fontSize="lg" fontWeight="medium">
                    {category.name}
                  </Text>
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Mensaje destacado */}
      <Box bg="black" color="white" py={2} px={4} textAlign="center" fontSize="sm">
        <Text>
          <Text as="span" fontWeight="bold">
            IMPORTANTE:
          </Text>{" "}
          Compra mínima 10 productos (No se incluyen pañuelos, ni tarjeteros)
        </Text>
      </Box>

      {/* Contenido principal */}
      <Container maxW="container.xl" py={8}>
        {/* Productos destacados */}
        <Box mb={12}>
          <Heading size="xl" textAlign="center" mb={6}>
            NUEVA TEMPORADA
          </Heading>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={6}
          >
            {featuredProducts.map((product) => (
              <ProductComponent
                key={product._id}
                product={product}
                onToggleLike={(liked) => handleToggleLike(product._id, liked)}
              />
            ))}
          </Grid>
        </Box>

        {/* Todos los productos */}
        <Box>
          <Heading size="xl" textAlign="center" mb={6}>
            TODOS LOS PRODUCTOS
          </Heading>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={6}
          >
            {safeProducts.map((product) => (
              <ProductComponent
                key={product._id}
                product={product}
                onToggleLike={(liked) => handleToggleLike(product._id, liked)}
              />
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
