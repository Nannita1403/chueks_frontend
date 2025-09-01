import { useState, useEffect } from "react";
import {
  Box, Flex, VStack, Heading, Button, Table, Thead, Tbody, Tr, Th, Td,
  IconButton, useToast, useColorModeValue, Container, Select
} from "@chakra-ui/react";
import { FiPlus, FiEdit, FiTrash2, FiCopy } from "react-icons/fi";
import axios from "axios";

import { useProducts } from "../../../context/Products/products.context.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import CreateProductModal from "../../../components/CreateProductModal/CreateProductModal.jsx";
import EditProductModal from "../../../components/EditProductModal/EditProductModal.jsx";

const AdminProducts = () => {
  const {
    products,
    getProducts,
    deleteProduct,
    updateProduct
  } = useProducts();

  const [isLoading, setIsLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    code: "", name: "", style: [], description: "", priceMin: 0, priceMay: 0,
    likes: [], elements: [], category: [], material: [], colors: [],
    height: 0, width: 0, depth: 0, imgPrimary: "", imgSecondary: "",
    status: "activo" // ✅ nuevo campo estado
  });

  const [productOptions, setProductOptions] = useState({
    styleOptions: [], categoryOptions: [], materialOptions: [], colorOptions: []
  });

  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");

  // ✅ cargar productos al montar
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
  }, [getProducts, toast]);

  // ✅ cargar opciones dinámicas
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/v1/meta/products/options");
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

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id); // ✅ ya actualiza el estado en el provider
      toast({ title: "Producto eliminado", status: "success", duration: 3000 });
    } catch (error) {
      console.error(error);
      toast({ title: "Error al eliminar", status: "error", duration: 3000 });
    }
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct._id, updatedProduct); // ✅ ya actualiza el estado en el provider
      toast({ title: "Producto actualizado", status: "success", duration: 3000 });
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Error al actualizar", status: "error", duration: 3000 });
    }
  };

  // ✅ actualizar estado desde el select
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

  // ✅ Filtrado
  let filteredProducts = products || [];
  if (filterCategory) filteredProducts = filteredProducts.filter(p => p.category?.includes(filterCategory));
  if (filterStatus) filteredProducts = filteredProducts.filter(p => p.status === filterStatus);

  // ✅ Ordenamiento
  if (sortField) {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const valA = a[sortField] || "";
      const valB = b[sortField] || "";
      if (typeof valA === "string") return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

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

          <Table variant="striped" colorScheme="gray" bg={bgColor}>
            <Thead>
              <Tr>
                <Th onClick={() => handleSort("name")}>Nombre</Th>
                <Th onClick={() => handleSort("category")}>Categoría</Th>
                <Th onClick={() => handleSort("priceMin")}>Precio</Th>
                <Th>Stock</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => {
                  const stock = p.colors?.reduce((acc, c) => acc + (c.stock || 0), 0) || 0;
                  return (
                    <Tr key={p._id}>
                      <Td>{p.name}</Td>
                      <Td>{Array.isArray(p.category) ? p.category.join(", ") : p.category}</Td>
                      <Td>${p.priceMin?.toLocaleString()} - ${p.priceMay?.toLocaleString()}</Td>
                      <Td>{stock}</Td>
                      <Td>
                        <Select
                          size="sm"
                          value={p.status || "activo"}
                          onChange={(e) => handleChangeStatus(p._id, e.target.value)}
                        >
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                        </Select>
                      </Td>
                      <Td>
                        <IconButton icon={<FiEdit />} mr={2} onClick={() => handleOpenEdit(p)} />
                        <IconButton icon={<FiCopy />} mr={2} onClick={() => handleDuplicate(p)} />
                        <IconButton icon={<FiTrash2 />} colorScheme="red" onClick={() => handleDelete(p._id)} />
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr><Td colSpan={6} textAlign="center">No hay productos</Td></Tr>
              )}
            </Tbody>
          </Table>
        </VStack>
      </Container>

      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        productOptions={productOptions}
      />

      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        productOptions={productOptions}
        onSave={handleUpdate}
      />
    </Box>
  );
};

export default AdminProducts;
