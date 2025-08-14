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
import { useElements } from "../../../context/Elements/elements.context.jsx"
import ElementsActions from "../../../reducers/elements/elements.actions.jsx"
import Loading from "../../../components/Loading/Loading.jsx"

const AdminCategories = () => {
  const { state: elementsState, dispatch: elementsDispatch } = useElements()
  const [isLoading, setIsLoading] = useState(true)
  const [currentElement, setCurrentElement] = useState(null)
  const [newElement, setNewElement] = useState({
    name: "",
    color: "#E91E63",
    description: "",
  })
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const bgColor = useColorModeValue("white", "gray.800")
  const toast = useToast()

  // Colores disponibles para las categorías
  const availableColors = [
    { name: "Fucsia", value: "#E91E63" },
    { name: "Cian", value: "#00BCD4" },
    { name: "Amarillo", value: "#FFC107" },
    { name: "Verde", value: "#4CAF50" },
    { name: "Rosa", value: "#E91E63" },
    { name: "Azul", value: "#2196F3" },
    { name: "Rojo", value: "#F44336" },
    { name: "Naranja", value: "#FF9800" },
    { name: "Púrpura", value: "#9C27B0" },
  ]

  useEffect(() => {
    const loadElements = async () => {
      setIsLoading(true)
      try {
        const response = await ElementsActions.getElements()
        elementsDispatch({ type: "GET_ELEMENTS_SUCCESS", payload: response.data })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadElements()
  }, [elementsDispatch, toast])

  const openEditDialog = (element) => {
    setCurrentElement(element)
    onEditOpen()
  }

  const handleNewElementChange = (e) => {
    const { name, value } = e.target
    setNewElement((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateElement = async () => {
    try {
      const response = await ElementsActions.createElement(newElement)
      elementsDispatch({ type: "CREATE_ELEMENT_SUCCESS", payload: response.data })
      toast({
        title: "Categoría creada",
        description: "La categoría se creó correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onCreateClose()
      setNewElement({
        name: "",
        color: "#E91E63",
        description: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleUpdateElement = async () => {
    try {
      const response = await ElementsActions.updateElement(currentElement._id, currentElement)
      elementsDispatch({ type: "UPDATE_ELEMENT_SUCCESS", payload: response.data })
      toast({
        title: "Categoría actualizada",
        description: "La categoría se actualizó correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      onEditClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleDeleteElement = async (elementId) => {
    try {
      await ElementsActions.deleteElement(elementId)
      elementsDispatch({ type: "DELETE_ELEMENT_SUCCESS", payload: elementId })
      toast({
        title: "Categoría eliminada",
        description: "La categoría se eliminó correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8}>
          <Flex justify="space-between" align="center" w="full">
            <Box>
              <Heading size="xl" mb={2}>
                Gestión de Categorías
              </Heading>
              <Text color="gray.600">Administra las categorías de productos</Text>
            </Box>
            <Button leftIcon={<FiPlus />} colorScheme="pink" onClick={onCreateOpen}>
              Nueva Categoría
            </Button>
          </Flex>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6} w="full">
            {elementsState.elements.map((element) => (
              <Card key={element._id} overflow="hidden">
                <Box bg={element.color} h={32} position="relative">
                  <Box position="absolute" top={2} right={2}>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Actions"
                        icon={<FiMoreHorizontal />}
                        variant="ghost"
                        bg="whiteAlpha.200"
                        color="white"
                        _hover={{ bg: "whiteAlpha.400" }}
                      />
                      <MenuList>
                        <MenuItem icon={<FiEdit />} onClick={() => openEditDialog(element)}>
                          Editar
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<FiTrash2 />} color="red.600" onClick={() => handleDeleteElement(element._id)}>
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
                      {element.name}
                    </Heading>
                  </Box>
                </Box>
                <CardBody p={4}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Badge variant="outline" bg="gray.100">
                      {element.productCount || 0} productos
                    </Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.600">
                    {element.description}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </VStack>
      </Container>

      {/* Modal de crear categoría */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Nueva Categoría</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nombre de la Categoría</FormLabel>
                <Input
                  name="name"
                  placeholder="Ej: Mochilas"
                  value={newElement.name}
                  onChange={handleNewElementChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Color</FormLabel>
                <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                  {availableColors.map((color) => (
                    <Box
                      key={color.value}
                      bg={color.value}
                      h={10}
                      borderRadius="md"
                      cursor="pointer"
                      transition="all 0.2s"
                      border={newElement.color === color.value ? "2px" : "0"}
                      borderColor="black"
                      _hover={{ opacity: 0.8 }}
                      onClick={() => setNewElement({ ...newElement, color: color.value })}
                      title={color.name}
                    />
                  ))}
                </Grid>
              </FormControl>

              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Input
                  name="description"
                  placeholder="Breve descripción de la categoría"
                  value={newElement.description}
                  onChange={handleNewElementChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onCreateClose}>
              Cancelar
            </Button>
            <Button colorScheme="pink" onClick={handleCreateElement}>
              Crear Categoría
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de editar categoría */}
      {currentElement && (
        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar Categoría: {currentElement.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Nombre de la Categoría</FormLabel>
                  <Input
                    value={currentElement.name}
                    onChange={(e) => setCurrentElement({ ...currentElement, name: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                    {availableColors.map((color) => (
                      <Box
                        key={color.value}
                        bg={color.value}
                        h={10}
                        borderRadius="md"
                        cursor="pointer"
                        transition="all 0.2s"
                        border={currentElement.color === color.value ? "2px" : "0"}
                        borderColor="black"
                        _hover={{ opacity: 0.8 }}
                        onClick={() => setCurrentElement({ ...currentElement, color: color.value })}
                        title={color.name}
                      />
                    ))}
                  </Grid>
                </FormControl>

                <FormControl>
                  <FormLabel>Descripción</FormLabel>
                  <Input
                    value={currentElement.description}
                    onChange={(e) => setCurrentElement({ ...currentElement, description: e.target.value })}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onEditClose}>
                Cancelar
              </Button>
              <Button colorScheme="pink" onClick={handleUpdateElement}>
                Guardar Cambios
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  )
}

export default AdminCategories
