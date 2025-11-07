import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  HStack,
  IconButton,
  Badge,
  Text,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useToast } from "../../Hooks/useToast.jsx";
import { useProducts } from "../../context/Products/products.context.jsx";

const CreateProductModal = ({
  isOpen,
  onClose,
  newProduct,
  setNewProduct,
  productOptions,
}) => {
  const { toast } = useToast();
  const { createProduct, getProducts } = useProducts();

  const [selectedColor, setSelectedColor] = useState("");
  const [colorStock, setColorStock] = useState(0);

  const handleChange = (e) =>
    setNewProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleNumberChange = (name, value) =>
    setNewProduct((prev) => ({ ...prev, [name]: Number(value) || 0 }));

  const handleSelectChange = (field, value) =>
    setNewProduct((prev) => ({ ...prev, [field]: [value] }));

  const handleAddColor = () => {
    if (!selectedColor || colorStock <= 0) {
      toast({
        title: "Faltan datos",
        description: "Selecciona un color y un stock válido.",
        status: "warning",
        duration: 2000,
      });
      return;
    }
    setNewProduct((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), { name: selectedColor, stock: colorStock }],
    }));
    setSelectedColor("");
    setColorStock(0);
  };

  const handleRemoveColor = (idx) => {
    const updated = [...(newProduct.colors || [])];
    updated.splice(idx, 1);
    setNewProduct((prev) => ({ ...prev, colors: updated }));
  };

  const handleCreate = async () => {
    try {
      await createProduct(newProduct);
      await getProducts(); // 
      toast({
        title: "Producto creado",
        description: `${newProduct.name || "Nuevo producto"} agregado correctamente.`,
        status: "success",
      });

      setNewProduct({
        code: "",
        name: "",
        style: [],
        description: "",
        priceMin: 0,
        priceMay: 0,
        likes: [],
        elements: [],
        category: [],
        material: [],
        colors: [],
        height: 0,
        width: 0,
        depth: 0,
        imgPrimary: "",
        imgSecondary: "",
      });

      onClose();
    } catch (error) {
      console.error("❌ Error al crear producto:", error);
      toast({
        title: "Error al crear producto",
        description: "Revisa los datos e inténtalo de nuevo.",
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Código</FormLabel>
              <Input name="code" value={newProduct.code} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input name="name" value={newProduct.name} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Input
                name="description"
                value={newProduct.description}
                onChange={handleChange}
              />
            </FormControl>

            <HStack>
              <FormControl>
                <FormLabel>Precio Mínimo</FormLabel>
                <NumberInput
                  min={0}
                  value={newProduct.priceMin}
                  onChange={(v) => handleNumberChange("priceMin", v)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Precio Mayorista</FormLabel>
                <NumberInput
                  min={0}
                  value={newProduct.priceMay}
                  onChange={(v) => handleNumberChange("priceMay", v)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </HStack>

            {/* Desplegables */}
            <FormControl>
              <FormLabel>Estilo</FormLabel>
              <Select
                placeholder="Seleccionar estilo"
                value={newProduct.style[0] || ""}
                onChange={(e) => handleSelectChange("style", e.target.value)}
              >
                {(productOptions.styleOptions || []).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select
                placeholder="Seleccionar categoría"
                value={newProduct.category[0] || ""}
                onChange={(e) => handleSelectChange("category", e.target.value)}
              >
                {(productOptions.categoryOptions || []).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Material</FormLabel>
              <Select
                placeholder="Seleccionar material"
                value={newProduct.material[0] || ""}
                onChange={(e) => handleSelectChange("material", e.target.value)}
              >
                {(productOptions.materialOptions || []).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* 🎨 Colores */}
            <FormControl>
              <FormLabel>Agregar Color</FormLabel>
              <HStack>
                <Select
                  placeholder="Seleccionar color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  {(productOptions.colorOptions || []).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </Select>
                <NumberInput
                  min={1}
                  value={colorStock}
                  onChange={(v) => setColorStock(Number(v) || 0)}
                  w="100px"
                >
                  <NumberInputField placeholder="Stock" />
                </NumberInput>
                <IconButton
                  icon={<FiPlus />}
                  colorScheme="pink"
                  aria-label="Agregar color"
                  onClick={handleAddColor}
                />
              </HStack>

              <VStack align="stretch" mt={3}>
                {(newProduct.colors || []).map((c, idx) => (
                  <HStack key={idx} justify="space-between">
                    <Badge colorScheme="purple" px={3} py={1} borderRadius="md">
                      {c.name}: {c.stock}
                    </Badge>
                    <IconButton
                      icon={<FiTrash2 />}
                      size="sm"
                      aria-label="Eliminar color"
                      onClick={() => handleRemoveColor(idx)}
                    />
                  </HStack>
                ))}
              </VStack>
            </FormControl>

            {/* Dimensiones */}
            <HStack>
              {["height", "width", "depth"].map((dim) => (
                <FormControl key={dim}>
                  <FormLabel>
                    {dim === "height"
                      ? "Alto"
                      : dim === "width"
                      ? "Ancho"
                      : "Profundidad"}
                  </FormLabel>
                  <NumberInput
                    min={0}
                    value={newProduct[dim]}
                    onChange={(v) => handleNumberChange(dim, v)}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              ))}
            </HStack>

            {/* Imágenes */}
            <FormControl>
              <FormLabel>Imagen Principal (URL o archivo)</FormLabel>
              <Input
                type="text"
                name="imgPrimary"
                value={newProduct.imgPrimary}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Imagen Secundaria (URL o archivo)</FormLabel>
              <Input
                type="text"
                name="imgSecondary"
                value={newProduct.imgSecondary}
                onChange={handleChange}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="pink" onClick={handleCreate}>
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProductModal;
