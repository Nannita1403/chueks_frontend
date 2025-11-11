import React, { useMemo, useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  Button, VStack, FormControl, FormLabel, Input, NumberInput, NumberInputField, Select,
  HStack, IconButton, Box, Text, Image
} from "@chakra-ui/react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useToast } from "../../Hooks/useToast.jsx";
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

const CreateOrEditProductModal = ({ isOpen, onClose, product, setProduct, productOptions, isEdit }) => {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState("");
  const [colorStock, setColorStock] = useState(1);
  const [previews, setPreviews] = useState({ imgPrimary: "", imgSecondary: "" });
  const [uploading, setUploading] = useState(false);

  const colorList = useMemo(() => {
    return Array.isArray(productOptions.colorOptions) && productOptions.colorOptions.length
      ? productOptions.colorOptions
      : Object.keys(COLOR_HEX_MAP);
  }, [productOptions]);

  useEffect(() => {
    if (product.imgPrimary instanceof File) {
      const url = URL.createObjectURL(product.imgPrimary);
      setPreviews(prev => ({ ...prev, imgPrimary: url }));
      return () => URL.revokeObjectURL(url);
    } else setPreviews(prev => ({ ...prev, imgPrimary: product.imgPrimary || "" }));
  }, [product.imgPrimary]);

  useEffect(() => {
    if (product.imgSecondary instanceof File) {
      const url = URL.createObjectURL(product.imgSecondary);
      setPreviews(prev => ({ ...prev, imgSecondary: url }));
      return () => URL.revokeObjectURL(url);
    } else setPreviews(prev => ({ ...prev, imgSecondary: product.imgSecondary || "" }));
  }, [product.imgSecondary]);

  const handleChange = (e) => setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNumberChange = (name, value) => setProduct(prev => ({ ...prev, [name]: Number(value) || 0 }));
  const handleSelectChange = (field, value) => setProduct(prev => ({ ...prev, [field]: [value] }));

  const handleAddColor = () => {
    if (!selectedColor) return toast({ title: "Selecciona un color", status: "warning" });
    if (!colorStock || colorStock <= 0) return toast({ title: "Stock inválido", status: "warning" });

    setProduct(prev => ({
      ...prev,
      colors: [...(prev.colors || []), { name: selectedColor, stock: Number(colorStock) }]
    }));
    setSelectedColor("");
    setColorStock(1);
  };

  const handleRemoveColor = (idx) => {
    setProduct(prev => {
      const updated = [...(prev.colors || [])];
      updated.splice(idx, 1);
      return { ...prev, colors: updated };
    });
  };

  const handleFileChange = (file, field) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast({ title: "Solo se permiten imágenes", status: "warning" });
    if (file.size > 5 * 1024 * 1024) return toast({ title: "La imagen es demasiado grande (máx 5MB)", status: "warning" });
    setProduct(prev => ({ ...prev, [field]: file }));
  };

  const handleRemoveFile = (field) => setProduct(prev => ({ ...prev, [field]: "" }));

    const handleSave = async () => {
    if (!product.code?.trim()) return toast({ title: "Código obligatorio", status: "warning" });
    if (!product.name?.trim()) return toast({ title: "Nombre obligatorio", status: "warning" });

    try {
        setUploading(true);
        const formData = new FormData();
        ["code","name","description","priceMin","priceMay","height","width","depth"].forEach(field => {
        formData.append(field, product[field] || "");
        });
        ["style","category","material","colors"].forEach(field => {
        formData.append(field, JSON.stringify(product[field] || []));
        });

        // Convertir elementos a {quantity, element:_id}
        const elementsToSend = (product.elements || []).map(el => ({
        quantity: el.quantity,
        element: el.element._id || el.element
        }));
        formData.append("elements", JSON.stringify(elementsToSend));

        if (product.imgPrimary instanceof File) formData.append("imgPrimary", product.imgPrimary);
        if (product.imgSecondary instanceof File) formData.append("imgSecondary", product.imgSecondary);

        if (isEdit) {
        await ApiService.putFormData(`/products/${product._id}`, formData);
        toast({ title: "Producto actualizado", status: "success" });
        } else {
        await ApiService.postFormData("/products", formData);
        toast({ title: "Producto creado", status: "success" });
        }
        onClose();
    } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Revisa los datos e inténtalo de nuevo.", status: "error" });
    } finally {
        setUploading(false);
    }
    };


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? `Editar Producto: ${product.name}` : "Crear Producto"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Código</FormLabel>
              <Input name="code" value={product.code || ""} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input name="name" value={product.name || ""} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Input name="description" value={product.description || ""} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Precio Mínimo</FormLabel>
              <NumberInput min={0} value={product.priceMin || 0} onChange={(v) => handleNumberChange("priceMin", v)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Precio Mayorista</FormLabel>
              <NumberInput min={0} value={product.priceMay || 0} onChange={(v) => handleNumberChange("priceMay", v)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Estilo</FormLabel>
              <Select placeholder="Seleccionar estilo" value={product.style?.[0] || ""} onChange={e => handleSelectChange("style", e.target.value)}>
                {(productOptions.styleOptions || []).map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select placeholder="Seleccionar categoría" value={product.category?.[0] || ""} onChange={e => handleSelectChange("category", e.target.value)}>
                {(productOptions.categoryOptions || []).map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Material</FormLabel>
              <Select placeholder="Seleccionar material" value={product.material?.[0] || ""} onChange={e => handleSelectChange("material", e.target.value)}>
                {(productOptions.materialOptions || []).map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Agregar color</FormLabel>
              <HStack>
                <Select placeholder={colorList.length ? "Seleccionar color" : "No hay colores"} value={selectedColor} onChange={e => setSelectedColor(e.target.value)} isDisabled={!colorList.length}>
                  {colorList.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
                <NumberInput min={1} value={colorStock} onChange={v => setColorStock(Number(v) || 0)} w="110px">
                  <NumberInputField />
                </NumberInput>
                <IconButton icon={<FiPlus />} aria-label="Agregar color" colorScheme="pink" onClick={handleAddColor} />
              </HStack>
              <VStack align="stretch" mt={2}>
                {(product.colors || []).map((c, i) => (
                  <HStack key={i} justify="space-between">
                    <HStack>
                      <Box w="20px" h="20px" bg={COLOR_HEX_MAP[c.name?.toLowerCase()] || "#ccc"} border="1px solid #999" borderRadius="sm"/>
                      <Text>{c.name} — Stock: {c.stock}</Text>
                    </HStack>
                    <IconButton icon={<FiTrash2 />} size="sm" onClick={() => handleRemoveColor(i)} />
                  </HStack>
                ))}
                {(!product.colors || !product.colors.length) && <Text color="gray.500" fontSize="sm">No hay colores agregados</Text>}
              </VStack>
            </FormControl>
            <FormControl>
              <FormLabel>Imagen Principal</FormLabel>
              <Input type="file" accept="image/*" onChange={e => handleFileChange(e.target.files[0], "imgPrimary")} />
              {previews.imgPrimary && (
                <Box position="relative" w="150px" mt={2}>
                  <Image src={previews.imgPrimary} boxSize="150px" objectFit="cover" borderRadius="md"/>
                  <IconButton icon={<FiX />} size="sm" position="absolute" top="2px" right="2px" colorScheme="red" onClick={() => handleRemoveFile("imgPrimary")} />
                </Box>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Imagen Secundaria</FormLabel>
              <Input type="file" accept="image/*" onChange={e => handleFileChange(e.target.files[0], "imgSecondary")} />
              {previews.imgSecondary && (
                <Box position="relative" w="150px" mt={2}>
                  <Image src={previews.imgSecondary} boxSize="150px" objectFit="cover" borderRadius="md"/>
                  <IconButton icon={<FiX />} size="sm" position="absolute" top="2px" right="2px" colorScheme="red" onClick={() => handleRemoveFile("imgSecondary")} />
                </Box>
              )}
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="pink" onClick={handleSave} isDisabled={uploading}>{isEdit ? "Guardar Cambios" : "Crear"}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateOrEditProductModal;
