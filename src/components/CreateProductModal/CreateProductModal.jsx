import React, { useMemo, useState } from "react";
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

  const COLOR_HEX_MAP = {
    "lila": "#C8A2C8", "verde": "#008000", "animal print": "#A0522D", "suela": "#8B4513",
    "nude": "#E3B7A0", "blanca": "#FFFFFF", "beige": "#F5F5DC", "gris": "#808080",
    "negro tramado": "#2F2F2F", "rose gold": "#B76E79", "negro": "#000000",
    "glitter dorada": "#FFD700", "dorada": "#FFD700", "borgoña": "#800020",
    "naranja": "#FFA500", "amarillo": "#FFFF00", "habano": "#A0522D", "cobre": "#B87333",
    "peltre": "#769DA6", "crema": "#FFFDD0", "celeste": "#87CEEB", "plateada": "#C0C0C0",
    "rosa": "#FFC0CB", "rojo": "#FF0000", "burdeos": "#800000", "vison": "#C4A69F",
    "verde oliva": "#808000", "cristal": "#E0FFFF", "negro opaco": "#1C1C1C",
    "negro croco": "#1A1A1A", "negro con crudo": "#2E2E2E", "turquesa": "#40E0D0",
    "gris claro": "#cccccc",
  };

  const colorList = useMemo(() => {
  const fromBackend =
    Array.isArray(productOptions.colorOptions) && productOptions.colorOptions.length > 0
      ? productOptions.colorOptions
      : Object.keys(COLOR_HEX_MAP);
      console.log("🎨 Opciones de producto recibidas:", productOptions);
    return fromBackend;
  }, [productOptions]);

  const handleChange = (e) =>
    setNewProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleNumberChange = (name, value) =>
    setNewProduct((prev) => ({ ...prev, [name]: Number(value) || 0 }));

  const handleSelectChange = (field, value) =>
    setNewProduct((prev) => ({ ...prev, [field]: [value] }));

    const handleAddColor = () => {
    if (!selectedColor) {
      toast({ title: "Selecciona un color", status: "warning" });
      return;
    }
    if (!colorStock || Number(colorStock) <= 0) {
      toast({ title: "Stock inválido", status: "warning" });
      return;
    }
    setNewProduct((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), { name: selectedColor, stock: Number(colorStock) }],
    }));
    setSelectedColor("");
    setColorStock(1);
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
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
              <Input name="description" value={newProduct.description} onChange={handleChange} />
            </FormControl>

            {/* Precios */}
            <HStack>
              <FormControl>
                <FormLabel>Precio Mínimo</FormLabel>
                <NumberInput min={0} value={newProduct.priceMin} onChange={(v) => handleNumberChange("priceMin", v)}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Precio Mayorista</FormLabel>
                <NumberInput min={0} value={newProduct.priceMay} onChange={(v) => handleNumberChange("priceMay", v)}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </HStack>

            {/* Selects principales */}
            <FormControl>
              <FormLabel>Estilo</FormLabel>
              <Select
                placeholder="Seleccionar estilo"
                value={newProduct.style?.[0] || ""}
                onChange={(e) => handleSelectSingle("style", e.target.value)}
              >
                {(productOptions.styleOptions || []).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select
                placeholder="Seleccionar categoría"
                value={newProduct.category?.[0] || ""}
                onChange={(e) => handleSelectSingle("category", e.target.value)}
              >
                {(productOptions.categoryOptions || []).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Material</FormLabel>
              <Select
                placeholder="Seleccionar material"
                value={newProduct.material?.[0] || ""}
                onChange={(e) => handleSelectSingle("material", e.target.value)}
              >
                {(productOptions.materialOptions || []).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </Select>
            </FormControl>

            {/* Colores */}
            <FormControl>
              <FormLabel>Agregar color</FormLabel>
              <HStack>
                <Select
                  placeholder={colorList.length ? "Seleccionar color" : "No hay colores disponibles"}
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  isDisabled={!colorList.length}
                >
                  {colorList.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </Select>
                <NumberInput min={1} value={colorStock} onChange={(v) => setColorStock(Number(v) || 0)} w="110px">
                  <NumberInputField />
                </NumberInput>
                <IconButton icon={<FiPlus />} aria-label="Agregar color" colorScheme="pink" onClick={handleAddColor} />
              </HStack>

              <VStack align="stretch" mt={3}>
                {(newProduct.colors || []).map((c, i) => (
                  <HStack key={i} justify="space-between">
                    <HStack>
                      <Box w="20px" h="20px" bg={COLOR_HEX_MAP[c.name?.toLowerCase()] || "#ccc"} border="1px solid #999" borderRadius="sm" />
                      <Text>{c.name} — Stock: {c.stock}</Text>
                    </HStack>
                    <IconButton icon={<FiTrash2 />} size="sm" onClick={() => handleRemoveColor(i)} />
                  </HStack>
                ))}
                {(!newProduct.colors || newProduct.colors.length === 0) && (
                  <Text color="gray.500" fontSize="sm">No hay colores agregados</Text>
                )}
              </VStack>
            </FormControl>

            {/* Imágenes */}
            <FormControl>
              <FormLabel>Imagen Principal (URL)</FormLabel>
              <Input name="imgPrimary" value={newProduct.imgPrimary} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Imagen Secundaria (URL)</FormLabel>
              <Input name="imgSecondary" value={newProduct.imgSecondary} onChange={handleChange} />
            </FormControl>

          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="pink" onClick={handleCreate}>Crear</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProductModal;