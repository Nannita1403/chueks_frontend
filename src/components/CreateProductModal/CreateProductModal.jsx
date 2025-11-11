import React, { useMemo, useState, useEffect } from "react";
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
  Text,
  Box,
  Image,
} from "@chakra-ui/react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useToast } from "../../Hooks/useToast.jsx";
import { useProducts } from "../../context/Products/products.context.jsx";
import ApiService from "../../reducers/api/Api.jsx";

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

const CreateProductModal = ({ isOpen, onClose, newProduct, setNewProduct, productOptions }) => {
  const { toast } = useToast();
  const { getProducts } = useProducts();
  const [uploading, setUploading] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [colorStock, setColorStock] = useState(0);
  const [previews, setPreviews] = useState({ imgPrimary: "", imgSecondary: "" });

  const colorList = useMemo(() => {
    return Array.isArray(productOptions.colorOptions) && productOptions.colorOptions.length > 0
      ? productOptions.colorOptions
      : Object.keys(COLOR_HEX_MAP);
  }, [productOptions]);

  // Generar previews cuando se selecciona un archivo
  useEffect(() => {
    if (newProduct.imgPrimary instanceof File) {
      const url = URL.createObjectURL(newProduct.imgPrimary);
      setPreviews(prev => ({ ...prev, imgPrimary: url }));
      return () => URL.revokeObjectURL(url);
    }
  }, [newProduct.imgPrimary]);

  useEffect(() => {
    if (newProduct.imgSecondary instanceof File) {
      const url = URL.createObjectURL(newProduct.imgSecondary);
      setPreviews(prev => ({ ...prev, imgSecondary: url }));
      return () => URL.revokeObjectURL(url);
    }
  }, [newProduct.imgSecondary]);

  const handleChange = (e) => setNewProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNumberChange = (name, value) => setNewProduct(prev => ({ ...prev, [name]: Number(value) || 0 }));
  const handleSelectChange = (field, value) => setNewProduct(prev => ({ ...prev, [field]: [value] }));

  const handleAddColor = () => {
    if (!selectedColor) return toast({ title: "Selecciona un color", status: "warning" });
    if (!colorStock || colorStock <= 0) return toast({ title: "Stock inválido", status: "warning" });

    setNewProduct(prev => ({
      ...prev,
      colors: [...(prev.colors || []), { name: selectedColor, stock: Number(colorStock) }]
    }));
    setSelectedColor("");
    setColorStock(1);
  };

  const handleRemoveColor = (idx) => {
    setNewProduct(prev => {
      const updated = [...(prev.colors || [])];
      updated.splice(idx, 1);
      return { ...prev, colors: updated };
    });
  };

  const handleRemoveFile = (field) => {
    setNewProduct(prev => ({ ...prev, [field]: "" }));
    setPreviews(prev => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (file, field) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast({ title: "Solo se permiten imágenes", status: "warning" });
    if (file.size > 5 * 1024 * 1024) return toast({ title: "La imagen es demasiado grande (máx 5MB)", status: "warning" });

    setNewProduct(prev => ({ ...prev, [field]: file }));
  };

  const handleCreate = async () => {
    try {
      setUploading(true);

      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, value]) => {
        if (["style","category","material","colors","elements"].includes(key)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });

      await ApiService.postFormData("/products", formData);

      toast({ title: "Producto creado", description: `${newProduct.name || "Nuevo producto"} agregado correctamente.`, status: "success" });

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

      setPreviews({ imgPrimary: "", imgSecondary: "" });
      await getProducts();
      onClose();
    } catch (error) {
      console.error("Error creando producto:", error);
      toast({ title: "Error al crear producto", description: "Revisa los datos e inténtalo de nuevo.", status: "error" });
    } finally {
      setUploading(false);
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

            {/* Código, Nombre, Descripción */}
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

            {/* Selects */}
            <FormControl>
              <FormLabel>Estilo</FormLabel>
              <Select placeholder="Seleccionar estilo" value={newProduct.style?.[0] || ""} onChange={(e) => handleSelectChange("style", e.target.value)}>
                {(productOptions.styleOptions || []).map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select placeholder="Seleccionar categoría" value={newProduct.category?.[0] || ""} onChange={(e) => handleSelectChange("category", e.target.value)}>
                {(productOptions.categoryOptions || []).map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Material</FormLabel>
              <Select placeholder="Seleccionar material" value={newProduct.material?.[0] || ""} onChange={(e) => handleSelectChange("material", e.target.value)}>
                {(productOptions.materialOptions || []).map(m => <option key={m} value={m}>{m}</option>)}
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
                  {colorList.map(color => <option key={color} value={color}>{color}</option>)}
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
                {(!newProduct.colors || newProduct.colors.length === 0) && <Text color="gray.500" fontSize="sm">No hay colores agregados</Text>}
              </VStack>
            </FormControl>

            {/* Imagen Principal */}
            <FormControl>
              <FormLabel>Imagen Principal</FormLabel>
              <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0], "imgPrimary")} />
              {previews.imgPrimary && (
                <Box position="relative" w="150px" mt={2}>
                  <Image src={previews.imgPrimary} boxSize="150px" objectFit="cover" borderRadius="md" />
                  <IconButton
                    icon={<FiX />}
                    size="sm"
                    position="absolute"
                    top="2px"
                    right="2px"
                    colorScheme="red"
                    onClick={() => handleRemoveFile("imgPrimary")}
                  />
                </Box>
              )}
            </FormControl>

            {/* Imagen Secundaria */}
            <FormControl>
              <FormLabel>Imagen Secundaria</FormLabel>
              <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0], "imgSecondary")} />
              {previews.imgSecondary && (
                <Box position="relative" w="150px" mt={2}>
                  <Image src={previews.imgSecondary} boxSize="150px" objectFit="cover" borderRadius="md" />
                  <IconButton
                    icon={<FiX />}
                    size="sm"
                    position="absolute"
                    top="2px"
                    right="2px"
                    colorScheme="red"
                    onClick={() => handleRemoveFile("imgSecondary")}
                  />
                </Box>
              )}
            </FormControl>

          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="pink" onClick={handleCreate} isDisabled={uploading}>Crear</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProductModal;
