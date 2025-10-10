import { useEffect, useState } from "react";
import {  Box, Flex, VStack, Heading, Button, Table, Thead, Tbody, Tr, Th, Td,
  IconButton, Input, useColorModeValue, Container } from "@chakra-ui/react";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import api from "../../../reducers/api/Api"; 
import { useToast } from "../../../Hooks/useToast.jsx";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState("");

 const { toast } = useToast();
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/categories"); 
        // ✅ Suponiendo que el back devuelve { categories: [...] }
        const normalized = (res.categories || []).map((c) =>
          typeof c === "string" ? { _id: c, name: c } : c
        );

        setCategories(normalized);
      } catch (error) {
        console.error("❌ Error cargando categorías:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías",
          status: "error",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await api.post("/products/categories", { name: newCategory });
      setCategories((prev) => [...prev, res.category]);
      setNewCategory("");
      toast({ title: "Categoría creada", status: "success", duration: 3000 });
    } catch (error) {
      console.error("❌ Error creando categoría:", error);
      toast({ title: "Error al crear", status: "error", duration: 3000 });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast({ title: "Categoría eliminada", status: "success", duration: 3000 });
    } catch (error) {
      console.error("❌ Error eliminando categoría:", error);
      toast({ title: "Error al eliminar", status: "error", duration: 3000 });
    }
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/products/categories/${id}`, { name: editValue });

      setCategories((prev) =>
        prev.map((c) => (c._id === id ? { ...c, name: editValue } : c))
      );

      setEditingCategory(null);
      toast({ title: "Categoría actualizada", status: "success", duration: 3000 });
    } catch (error) {
      console.error("❌ Error editando categoría:", error);
      toast({ title: "Error al actualizar", status: "error", duration: 3000 });
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="5xl">
        <VStack spacing={6}>
          <Flex justify="space-between" align="center" w="full">
            <Heading size="xl">Gestión de Categorías</Heading>
            <Flex>
              <Input
                placeholder="Nueva categoría"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                mr={2}
              />
              <Button leftIcon={<FiPlus />} colorScheme="pink" onClick={handleCreate}>
                Crear
              </Button>
            </Flex>
          </Flex>

          <Table variant="striped" colorScheme="gray" bg={bgColor}>
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories.length > 0 ? (
                categories.map((c) => (
                  <Tr key={c._id || c.name}>
                    <Td>
                      {editingCategory === c._id ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      ) : (
                        c.name
                      )}
                    </Td>
                    <Td>
                      {editingCategory === c._id ? (
                        <Button
                          size="sm"
                          colorScheme="green"
                          mr={2}
                          onClick={() => handleEditSave(c._id)}
                        >
                          Guardar
                        </Button>
                      ) : (
                        <IconButton
                          icon={<FiEdit />}
                          mr={2}
                          onClick={() => {
                            setEditingCategory(c._id);
                            setEditValue(c.name);
                          }}
                        />
                      )}
                      <IconButton
                        icon={<FiTrash2 />}
                        colorScheme="red"
                        onClick={() => handleDelete(c._id)}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={2} textAlign="center">
                    {isLoading ? "Cargando..." : "No hay categorías"}
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminCategories;
