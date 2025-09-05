// src/pages/Admin/AdminProducts.jsx
import { useState, useEffect } from "react";
import {
  Box, Flex, VStack, Heading, Button, IconButton,
  useColorModeValue, Container, Select, SimpleGrid, Card, Badge
} from "@chakra-ui/react";
import { FiPlus, FiEdit, FiTrash2, FiCopy } from "react-icons/fi";
import axios from "axios";
import { useToast } from "../../../Hooks/useToast.jsx";
import { useProducts } from "../../../context/Products/products.context.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import CreateProductModal from "../../../components/CreateProductModal/CreateProductModal.jsx";
import EditProductModal from "../../../components/EditProductModal/EditProductModal.jsx";

import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@chakra-ui/react";

const AdminProducts = () => {
  const {
    products,
    getProducts,
    deleteProduct,
    updateProduct
  } = useProducts();

  const [isLoading, setIsLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    code: "", name: "", style: [], description: "", priceMin: 0, priceMay: 0,
    likes: [], elements: [], category: [], material: [], colors: [],
    height: 0, width: 0, depth: 0, imgPrimary: "", imgSecondary: "",
    status: "activo"
  });

  const [productOptions, setProductOptions] = useState({
    styleOptions: [], categoryOptions: [], materialOptions: [], colorOptions: []
  });

  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

const { toast } = useToast();
  const bgColor = useColorModeValue("white", "gray.800");

  // cargar productos al montar
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await getProducts();
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          status: "error",
          duration: 3000
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // cargar opciones dinámicas
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const { data } = await axios.get("https://chueks-backend.vercel.app/api/v1/meta/products/options");
        setProductOptions(data);
      } catch (err) {
        console.error("Error cargando opciones de productos:", err);
      }
    };
    loadOptions();
  }, []);

  const handleOpenEdit = (product) => {
    setCurrentProduct(product);
    setIsEditOpen(true);
  };

  const handleDuplicate = (product) => {
    setNewProduct({ ...product, code: product.code + "_copy", name: product.name + " (Copy)" });
    setIsCreateOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId);
      toast({ title: "Producto eliminado", status: "success", duration: 3000 });
      setIsDeleteOpen(false);
      setDeleteId(null);
      setCurrentProduct(null);
    } catch (error) {
      console.error(error);
      toast({ title: "Error al eliminar", status: "error", duration: 3000 });
    }
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct._id, updatedProduct);
      toast({ title: "Producto actualizado", status: "success", duration: 3000 });
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Error al actualizar", status: "error", duration: 3000 });
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await updateProduct(id, { status: newStatus });
      toast({ title: "Estado actualizado", status: "success", duration: 3000 });
    } catch (error) {
      console.error(error);
      toast({ title: "Error al cambiar estado", status: "error", duration: 3000 });
    }
  };

  if (isLoading) return <Loading />;

  // Filtrado
  let filteredProducts = products || [];
  if (filterCategory) filteredProducts = filteredProducts.filter(p => p.category?.includes(filterCategory));
  if (filterStatus) filteredProducts = filteredProducts.filter(p => p.status === filterStatus);

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <VStack spacing={6}>
          <Flex justify="space-between" align="center" w="full">
            <Heading size="xl">Gestión de Productos</Heading>
            <Button leftIcon={<FiPlus />} colorScheme="pink" onClick={() => setIsCreateOpen(true)}>Nuevo Producto</Button>
          </Flex>

          <Flex w="full" mb={4}>
            <Select placeholder="Filtrar por categoría" mr={2} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              {productOptions.categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select placeholder="Filtrar por estado" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </Select>
          </Flex>

          {/* Tarjetas de productos */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <Card key={p._id} shadow="md" borderRadius="lg" overflow="hidden" bg={bgColor}>
                  <Box as="img" src={p.imgPrimary} alt={p.name} w="100%" h="200px" objectFit="cover" />

                  <Box p={4}>
                    <Heading size="md" mb={2}>{p.name}</Heading>
                    <Box fontSize="sm" color="gray.600" mb={1}>
                      <b>Categoría:</b> {Array.isArray(p.category) ? p.category.join(", ") : p.category}
                    </Box>
                    <Box fontSize="sm" color="gray.600" mb={1}>
                      <b>Precio:</b> ${p.priceMin?.toLocaleString()} - ${p.priceMay?.toLocaleString()}
                    </Box>

                    <Box fontSize="sm" color="gray.600" mb={1}>
                      <b>Stock:</b>
                      <Flex wrap="wrap" gap={2} mt={1}>
                        {p.colors && p.colors.length > 0 ? (
                          p.colors.map((c, idx) => (
                            <Badge
                              key={idx}
                              colorScheme="purple"
                              borderRadius="md"
                              px={2}
                              py={1}
                            >
                              {c.name}: {c.stock}
                            </Badge>
                          ))
                        ) : (
                          <Badge colorScheme="red">Sin stock</Badge>
                        )}
                      </Flex>
                    </Box>

                    <Box fontSize="sm" color="gray.600" mb={3}>
                      <b>Estado:</b>{" "}
                      <Select
                        size="sm"
                        value={p.status || "activo"}
                        onChange={(e) => handleChangeStatus(p._id, e.target.value)}
                        w="auto"
                        display="inline-block"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </Select>
                    </Box>

                    <Flex justify="flex-end" gap={2}>
                      <IconButton icon={<FiEdit />} aria-label="Editar" onClick={() => handleOpenEdit(p)} />
                      <IconButton icon={<FiCopy />} aria-label="Duplicar" onClick={() => handleDuplicate(p)} />
                      <IconButton
                        icon={<FiTrash2 />}
                        aria-label="Eliminar"
                        colorScheme="red"
                        onClick={() => { setCurrentProduct(p); setDeleteId(p._id); setIsDeleteOpen(true); }}
                      />
                    </Flex>
                  </Box>
                </Card>
              ))
            ) : (
              <Box textAlign="center" py={10} color="gray.500">
                No hay productos
              </Box>
            )}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Modal de creación */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        productOptions={productOptions}
      />

      {/* Modal de edición */}
      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        productOptions={productOptions}
        onSave={handleUpdate}
      />

      {/* Modal de eliminación */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalBody>
            {currentProduct && (
              <Card shadow="lg" borderRadius="lg" overflow="hidden">
                <Box as="img"
                  src={currentProduct.imgPrimary}
                  alt={currentProduct.name}
                  w="100%"
                  h="200px"
                  objectFit="cover"
                />
                <Box p={4}>
                  <Heading size="md" mb={2}>{currentProduct.name}</Heading>
                  <Box color="gray.600">
                    Este producto se eliminará permanentemente.  
                    ¿Estás seguro de continuar?
                  </Box>
                </Box>
              </Card>
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={() => setIsDeleteOpen(false)}>Cancelar</Button>
            <Button colorScheme="red" onClick={handleDelete}>Eliminar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminProducts;
