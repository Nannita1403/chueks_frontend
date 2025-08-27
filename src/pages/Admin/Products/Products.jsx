// AdminProducts.jsx
import { useState, useEffect } from "react"
import {
  Box,
  Flex,
  VStack,
  Text,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  Badge,
  Card,
  CardBody,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useColorModeValue,
  Container,
  useToast,
} from "@chakra-ui/react"
import { FiPlus, FiEdit, FiTrash2, FiMoreHorizontal } from "react-icons/fi"
import { useProducts } from "../../../context/Products/products.context.jsx"
import ProductsActions from "../../../reducers/products/products.actions.jsx"
import Loading from "../../../components/Loading/Loading.jsx"

const AdminProducts = () => {
  const { state: productsState, dispatch: productsDispatch } = useProducts()
  const [isLoading, setIsLoading] = useState(true)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
  })
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const toast = useToast()
  const bgColor = useColorModeValue("white", "gray.800")

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const response = await ProductsActions.getProducts()
        productsDispatch({ type: "GET_PRODUCTS_SUCCESS", payload: response.data })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [productsDispatch, toast])

  const openEditDialog = (product) => {
    setCurrentProduct(product)
    onEditOpen()
  }

  const handleNewProductChange = (e) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateProduct = async () => {
    try {
      const response = await ProductsActions.createProduct(newProduct)
      productsDispatch({ type: "CREATE_PRODUCT_SUCCESS", payload: response.data })
      toast({
        title: "Producto creado",
        description: "El producto se creó correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onCreateClose()
      setNewProduct({ name: "", price: 0, category: "", description: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el producto",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleUpdateProduct = async () => {
    try {
      const response = await ProductsActions.updateProduct(currentProduct._id, currentProduct)
      productsDispatch({ type: "UPDATE_PRODUCT_SUCCESS", payload: response.data })
      toast({
        title: "Producto actualizado",
        description: "El producto se actualizó correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onEditClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await ProductsActions.deleteProduct(productId)
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

  if (isLoading) return <Loading />

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8}>
          <Flex justify="space-between" align="center" w="full">
            <Box>
              <Heading size="xl" mb={2}>
                Gestión de Productos
              </Heading>
              <Text color="gray.600">Administra los productos de la tienda</Text>
            </Box>
            <Button leftIcon={<FiPlus />} colorScheme="pink" onClick={onCreateOpen}>
              Nuevo Producto
            </Button>
          </Flex>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} w="full">
            {productsState.products.map((product) => (
              <Card key={product._id} overflow="hidden">
                <Box bg={bgColor} h={32} position="relative">
                  <Box position="absolute" top={2} right={2}>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Actions"
                        icon={<FiMoreHorizontal />}
                        variant="ghost"
                      />
                      <MenuList>
                        <MenuItem icon={<FiEdit />} onClick={() => openEditDialog(product)}>
                          Editar
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<FiTrash2 />} color="red.600" onClick={() => handleDeleteProduct(product._id)}>
                          Eliminar
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    w="full"
                    p={4}
                    bgGradient="linear(to-t, blackAlpha.600, transparent)"
                  >
                    <Heading size="lg" color="white">
                      {product.name}
                    </Heading>
                  </Box>
                </Box>
                <CardBody p={4}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Badge variant="outline" bg="gray.100">
                      {product.category}
                    </Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.600">
                    {product.description}
                  </Text>
                  <Text fontWeight="bold" mt={2}>
                    ${product.price.toLocaleString()}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </VStack>
      </Container>

      {/* Modal Crear */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Nuevo Producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input name="name" value={newProduct.name} onChange={handleNewProductChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Categoría</FormLabel>
                <Input name="category" value={newProduct.category} onChange={handleNewProductChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Precio</FormLabel>
                <Input
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleNewProductChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Input name="description" value={newProduct.description} onChange={handleNewProductChange} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onCreateClose}>
              Cancelar
            </Button>
            <Button colorScheme="pink" onClick={handleCreateProduct}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Editar */}
      {currentProduct && (
        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar Producto: {currentProduct.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Categoría</FormLabel>
                  <Input
                    value={currentProduct.category}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Precio</FormLabel>
                  <Input
                    type="number"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Descripción</FormLabel>
                  <Input
                    value={currentProduct.description}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onEditClose}>
                Cancelar
              </Button>
              <Button colorScheme="pink" onClick={handleUpdateProduct}>
                Guardar Cambios
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  )
}

export default AdminProducts
