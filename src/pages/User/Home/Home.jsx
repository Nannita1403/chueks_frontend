"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Badge,
  Card,
  CardBody,
  Grid,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Container,
  useColorModeValue,
  Image,
} from "@chakra-ui/react"
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu } from "react-icons/fi"
import { useProducts } from "../../../context/Products/products.context.jsx"

import { useAuth } from "../../../context/Auth/auth.context.jsx"
import Loading from "../../../components/Loading/Loading.jsx"
import { useElements } from "../../../context/Elements/elements.context.jsx"

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")

  const { products, loading: productsLoading, getProducts } = useProducts()
  const { elements, loading: elementsLoading, getElements } = useElements()
  const { user, cartItems, wishlistItems } = useAuth()

  useEffect(() => {
    getProducts()
    getElements()
  }, [])

  if (productsLoading || elementsLoading) {
    return <Loading />
  }

  // Obtener categorías de elements
  const categories = elements || []

  // Productos destacados (primeros 6)
  const featuredProducts = products?.slice(0, 6) || []

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header/Navbar */}
      <Box position="sticky" top={0} zIndex={50} bg={bgColor} borderBottom="1px" borderColor={borderColor}>
        <Container maxW="container.xl" py={3}>
          <Flex align="center" justify="space-between">
            <HStack spacing={4}>
              <IconButton
                aria-label="Menu"
                icon={<FiMenu />}
                variant="ghost"
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
              />
              <Link to="/dashboard">
                <Image src="/logo-chueks.png" alt="CHUEKS Logo" width={120} height={40} />
              </Link>
            </HStack>

            <Box display={{ base: "none", md: "block" }} flex={1} maxW="md" mx={4}>
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

            <HStack spacing={2}>
              <Link to="/dashboard/search">
                <IconButton
                  aria-label="Search"
                  icon={<FiSearch />}
                  variant="ghost"
                  display={{ base: "flex", md: "none" }}
                />
              </Link>
              <Link to="/dashboard/wishlist">
                <Box position="relative">
                  <IconButton aria-label="Wishlist" icon={<FiHeart />} variant="ghost" />
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
              <Link to="/dashboard/cart">
                <Box position="relative">
                  <IconButton aria-label="Cart" icon={<FiShoppingBag />} variant="ghost" />
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
              <Link to="/dashboard/profile">
                <IconButton aria-label="Profile" icon={<FiUser />} variant="ghost" />
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Drawer para móvil */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Categorías</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              {categories.map((category) => (
                <Link key={category._id} to={`/dashboard/category/${category._id}`}>
                  <Text fontSize="lg" fontWeight="medium">
                    {category.name}
                  </Text>
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Mensaje destacado de compra mínima */}
      <Box bg="black" color="white" py={2} px={4} textAlign="center" fontSize="sm">
        <Text>
          <Text as="span" fontWeight="bold">
            IMPORTANTE:
          </Text>{" "}
          Compra mínima 10 productos (No se incluyen pañuelos, ni tarjeteros)
        </Text>
      </Box>

      <Container maxW="container.xl" py={8}>
        {/* Nueva Temporada - Productos destacados */}
        <Box mb={12}>
          <Heading size="xl" textAlign="center" mb={6}>
            NUEVA TEMPORADA
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </Grid>
        </Box>

        {/* Categorías */}
        <Box>
          <Heading size="xl" textAlign="center" mb={6}>
            CATEGORÍAS
          </Heading>
          <Grid
            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" }}
            gap={4}
          >
            {categories.map((category) => (
              <Link key={category._id} to={`/dashboard/category/${category._id}`}>
                <Box
                  bg="brand.500"
                  borderRadius="lg"
                  overflow="hidden"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }}
                  cursor="pointer"
                >
                  <Flex direction="column" align="center" p={6}>
                    <Box
                      w={32}
                      h={32}
                      borderRadius="full"
                      bg="whiteAlpha.200"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mb={4}
                    >
                      <Image
                        src={category.logo || "/placeholder.svg"}
                        alt={category.name}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <Heading size="md" color="white">
                      {category.name}
                    </Heading>
                  </Flex>
                </Box>
              </Link>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

// Componente de tarjeta de producto
function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToWishlist, removeFromWishlist } = useAuth()

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product._id)
    }
    setIsWishlisted(!isWishlisted)
  }

  return (
    <Card overflow="hidden" h="full">
      <Box position="relative">
        <Link to={`/dashboard/product/${product._id}`}>
          <Image
            src={product.imgPrimary || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            style={{ width: "100%", objectFit: "cover", aspectRatio: "1" }}
          />
        </Link>
        <IconButton
          aria-label="Add to wishlist"
          icon={<FiHeart fill={isWishlisted ? "#ec4899" : "none"} color={isWishlisted ? "#ec4899" : "currentColor"} />}
          position="absolute"
          top={2}
          right={2}
          bg="whiteAlpha.800"
          _hover={{ bg: "white" }}
          onClick={handleWishlistToggle}
        />
      </Box>
      <CardBody p={4}>
        <Link to={`/dashboard/product/${product._id}`}>
          <Heading size="md" mb={1}>
            {product.name}
          </Heading>
        </Link>
        <Flex justify="space-between" align="center" mb={2}>
          <Text color="gray.600" fontSize="sm">
            {product.style}
          </Text>
          <Text fontWeight="bold">${product.price?.toLocaleString()}</Text>
        </Flex>
        <HStack mb={3}>
          <Text fontSize="sm" color="gray.500">
            Colores:
          </Text>
          <Text fontSize="xs">{product.colors?.join(", ")}</Text>
        </HStack>
        <Button w="full" variant="solid">
          Agregar al carrito
        </Button>
      </CardBody>
    </Card>
  )
}

export default DashboardPage
