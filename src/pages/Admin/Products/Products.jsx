import { useState, useEffect } from "react";
import {
  Box, Flex, VStack, Heading, Button, Table, Thead, Tbody, Tr, Th, Td,
  IconButton, useToast, useColorModeValue, Container, Select
} from "@chakra-ui/react";
import { FiPlus, FiEdit, FiTrash2, FiCopy } from "react-icons/fi";
import axios from "axios";

import { useProducts } from "../../../context/Products/products.context.jsx";
import ProductsActions from "../../../reducers/products/products.actions.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import CreateProductModal from "../../../components/CreateProductModal/CreateProductModal.jsx";
import EditProductModal from "../../../components/EditProductModal/EditProductModal.jsx";

const AdminProducts = () => {
  const { products: productsState, dispatch: productsDispatch } = useProducts();
  const [isLoading, setIsLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    code: "", name: "", style: [], description: "", priceMin: 0, priceMay: 0,
    likes: [], elements: [], category: [], material: [], colors: [],
    height: 0, width: 0, depth: 0, imgPrimary: "", imgSecondary: ""
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

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await ProductsActions.getProducts();
        productsDispatch({ type: "GET_PRODUCTS", payload: products });
      } catch (error) {
        toast({ title: "Error", description: "No se pudieron cargar los productos", status: "error", duration: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [productsDispatch, toast]);

  // Cargar opciones dinámicas desde backend
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
      await ProductsActions.deleteProduct(id);
      productsDispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: id });
      toast({ title: "Producto eliminado", status: "success", duration: 3000 });
    } catch (error) {
      toast({ title: "Error al eliminar", status: "error", duration: 3000 });
    }
  };

  if (isLoading) return <Loading />;

  // Filtrado
  let products = productsState.products || [];
  if (filterCategory) products = products.filter(p => p.category?.includes(filterCategory));
  if (filterStatus) products = products.filter(p => filterStatus === "activo" ? p.imgPrimary : !p.imgPrimary);

  // Ordenamiento
  if (sortField) {
    products = products.sort((a, b) => {
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
              {products.length > 0 ? (
                products.map(p => {
                  const stock = p.colors?.reduce((acc, c) => acc + (c.stock || 0), 0) || 0;
                  const estado = p.imgPrimary ? "Activo" : "Inactivo";
                  return (
                    <Tr key={p._id}>
                      <Td>{p.name}</Td>
                      <Td>{Array.isArray(p.category) ? p.category.join(", ") : p.category}</Td>
                      <Td>${p.priceMin?.toLocaleString()} - ${p.priceMay?.toLocaleString()}</Td>
                      <Td>{stock}</Td>
                      <Td>{estado}</Td>
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
        isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}
        newProduct={newProduct} setNewProduct={setNewProduct}
        productOptions={productOptions}
      />

      <EditProductModal
        isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}
        currentProduct={currentProduct} setCurrentProduct={setCurrentProduct}
        productOptions={productOptions}
      />
    </Box>
  );
};

export default AdminProducts;
