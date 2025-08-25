import { useState, useEffect } from "react"
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Badge,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardBody,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Checkbox,
  useColorModeValue,
  Container,
  Heading,
  Image,
  useToast,
} from "@chakra-ui/react"
import { FiPlus, FiSearch, FiFilter, FiMoreHorizontal, FiEdit, FiTrash2, FiCopy, FiEye } from "react-icons/fi"
import { useProducts } from "../../../context/Products/products.context.jsx"
import { useElements } from "../../../context/Elements/elements.context.jsx"

import Loading from "../../../components/Loading/Loading.jsx"

const AdminProducts = () => {
  const { products, loading, error, getProducts, dispatch: productsDispatch } = useProducts()
  const { elements, getElements, dispatch: elementsDispatch } = useElements()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedProducts, setSelectedProducts] = useState([])
  const [currentProduct, setCurrentProduct] = useState(null)

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()

  const bgColor = useColorModeValue("white", "gray.800")
  const toast = useToast()

  // 🚀 Llamar datos solo una vez al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        await getProducts()
        await getElements()
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
    loadData()
 }, [getProducts, getElements]);// 👈 Dependencias llenas useCallback, solo 1 vez

  if (loading) return <Loading />

  // 🔍 Filtrado
  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "" || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // ✅ Selección múltiple
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((product) => product._id))
    }
  }

  const toggleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const openEditDialog = (product) => {
    setCurrentProduct(product)
    onEditOpen()
  }

  const handleDeleteProduct = async (productId) => {
    try {
      // Aquí deberías usar productsActions.deleteProduct desde el contexto
      // await deleteProduct(productId)
      productsDispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: productId })
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8}>
          <Flex justify="space-between" align="center" w="full">
            <Box>
              <Heading size="xl" mb={2}>
                Gestión de Productos
              </Heading>
              <Text color="gray.600">Administra tu catálogo de productos</Text>
            </Box>
            <Button leftIcon={<FiPlus />} colorScheme="pink" onClick={onCreateOpen}>
              Nuevo Producto
            </Button>
          </Flex>

          {/* 🔍 Filtros */}
          <Card w="full">
            <CardBody>
              <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "start", md: "center" }} gap={4}>
                <Box flex={1} maxW="md">
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
                  <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} w="180px">
                    <option value="">Todas las categorías</option>
                    {(elements || []).map((element) => (
                      <option key={element._id} value={element.name}>
                        {element.name}
                      </option>
                    ))}
                  </Select>

                  <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} w="180px">
                    <option value="">Todos los estados</option>
                    <option value="active">Activo</option>
                    <option value="low-stock">Stock bajo</option>
                    <option value="out-of-stock">Sin stock</option>
                  </Select>

                  <IconButton aria-label="Filter" icon={<FiFilter />} variant="outline" />
                </HStack>
              </Flex>
            </CardBody>
          </Card>

          {/* 🗑 Acciones masivas */}
          {selectedProducts.length > 0 && (
            <Card w="full">
              <CardBody>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" fontWeight="medium">
                    {selectedProducts.length} {selectedProducts.length === 1 ? "producto" : "productos"} seleccionados
                  </Text>
                  <HStack spacing={2}>
                    <Button variant="outline" size="sm" colorScheme="red" leftIcon={<FiTrash2 />}>
                      Eliminar
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={<FiEdit />}>
                      Editar
                    </Button>
                  </HStack>
                </Flex>
              </CardBody>
            </Card>
          )}

          {/* 📦 Tabla */}
          <Card w="full">
            <CardBody p={0}>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr bg="gray.50">
                      <Th>
                        <HStack>
                          <Checkbox
                            isChecked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                            onChange={toggleSelectAll}
                          />
                          <Text>Producto</Text>
                        </HStack>
                      </Th>
                      <Th>Categoría</Th>
                      <Th>Precio</Th>
                      <Th>Stock</Th>
                      <Th>Estado</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredProducts.map((product) => (
                      <Tr key={product._id} _hover={{ bg: "gray.50" }}>
                        <Td>
                          <HStack>
                            <Checkbox
                              isChecked={selectedProducts.includes(product._id)}
                              onChange={() => toggleProductSelection(product._id)}
                            />
                            <HStack>
                              <Box w={10} h={10} borderRadius="md" overflow="hidden">
                                <Image
                                  src={product.imgPrimary || "/placeholder.svg"}
                                  alt={product.name}
                                  boxSize="40px"
                                  objectFit="cover"
                                />
                              </Box>
                              <Text fontWeight="medium">{product.name}</Text>
                            </HStack>
                          </HStack>
                        </Td>
                        <Td>{product.category}</Td>
                        <Td>${product.price?.toLocaleString()}</Td>
                        <Td>
                          <VStack spacing={1} align="start">
                            <Text fontWeight="medium">{product.totalStock || 0} total</Text>
                            <Text fontSize="xs" color="gray.500">
                              {product.colors?.map((color) => `${color.name}: ${color.stock}`).join(", ")}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <ProductStatusBadge stock={product.totalStock || 0} />
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton as={IconButton} aria-label="Actions" icon={<FiMoreHorizontal />} variant="ghost" />
                            <MenuList>
                              <MenuItem icon={<FiEye />}>Ver detalles</MenuItem>
                              <MenuItem icon={<FiEdit />} onClick={() => openEditDialog(product)}>
                                Editar
                              </MenuItem>
                              <MenuItem icon={<FiCopy />}>Duplicar</MenuItem>
                              <MenuDivider />
                              <MenuItem icon={<FiTrash2 />} color="red.600" onClick={() => handleDeleteProduct(product._id)}>
                                Eliminar
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              {/* 📑 Paginación */}
              <Flex justify="space-between" align="center" px={4} py={3} borderTop="1px" borderColor="gray.200">
                <Text fontSize="sm" color="gray.500">
                  Mostrando{" "}
                  <Text as="span" fontWeight="medium">
                    {filteredProducts.length}
                  </Text>{" "}
                  de{" "}
                  <Text as="span" fontWeight="medium">
                    {products?.length || 0}
                  </Text>{" "}
                  productos
                </Text>
              </Flex>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}

function ProductStatusBadge({ stock }) {
  if (stock === 0) {
    return <Badge colorScheme="red">Sin stock</Badge>
  } else if (stock < 10) {
    return <Badge colorScheme="yellow">Stock bajo</Badge>
  } else {
    return <Badge colorScheme="green">Activo</Badge>
  }
}

export default AdminProducts
