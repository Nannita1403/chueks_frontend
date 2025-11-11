import React, { useMemo, useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, Button, VStack, FormControl, FormLabel, Input,
  NumberInput, NumberInputField, Select, HStack, IconButton, Text, Box, Image
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
  const [colorStock, setColorStock] = useState(1);
  const [previews, setPreviews] = useState({ imgPrimary: "", imgSecondary: "" });

  const colorList = useMemo(() => {
    return Array.isArray(productOptions.colorOptions) && productOptions.colorOptions.length
      ? productOptions.colorOptions
      : Object.keys(COLOR_HEX_MAP);
  }, [productOptions]);

  // Generar previews de imágenes
  useEffect(() => {
    if (newProduct.imgPrimary instanceof File) {
      const url = URL.createObjectURL(newProduct.imgPrimary);
      setPreviews(prev => ({ ...prev, imgPrimary: url }));
      return () => URL.revokeObjectURL(url);
    } else setPreviews(prev => ({ ...prev, imgPrimary: "" }));
  }, [newProduct.imgPrimary]);

  useEffect(() => {
    if (newProduct.imgSecondary instanceof File) {
      const url = URL.createObjectURL(newProduct.imgSecondary);
      setPreviews(prev => ({ ...prev, imgSecondary: url }));
      return () => URL.revokeObjectURL(url);
    } else setPreviews(prev => ({ ...prev, imgSecondary: "" }));
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

  const handleRemoveFile = (field) => setNewProduct(prev => ({ ...prev, [field]: "" }));

  const handleFileChange = (file, field) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast({ title: "Solo se permiten imágenes", status: "warning" });
    if (file.size > 5 * 1024 * 1024) return toast({ title: "La imagen es demasiado grande (máx 5MB)", status: "warning" });
    setNewProduct(prev => ({ ...prev, [field]: file }));
  };

  const handleCreate = async () => {
    if (!newProduct.code?.trim()) return toast({ title: "Código obligatorio", status: "warning" });
    if (!newProduct.name?.trim()) return toast({ title: "Nombre obligatorio", status: "warning" });

    try {
      setUploading(true);
      const formData = new FormData();

      // Campos básicos
      ["code","name","description","priceMin","priceMay","height","width","depth","weith"].forEach(field => {
        formData.append(field, newProduct[field] || "");
      });

      // Arrays
      ["style","category","material","colors","elements"].forEach(field => {
        formData.append(field, JSON.stringify(newProduct[field] || []));
      });

      // Archivos
      if (newProduct.imgPrimary instanceof File) formData.append("imgPrimary", newProduct.imgPrimary);
      if (newProduct.imgSecondary instanceof File) formData.append("imgSecondary", newProduct.imgSecondary);

      await ApiService.postFormData("/products", formData);
      toast({ title: "Producto creado", description: `${newProduct.name} agregado correctamente.`, status: "success" });

      // Reset
      setNewProduct({
        code: "", name: "", style: [], description: "", priceMin: 0, priceMay: 0,
        likes: [], elements: [], category: [], material: [], colors: [],
        height: 0, width: 0, depth: 0, weith: 0, imgPrimary: "", imgSecondary: ""
      });
      setPreviews({ imgPrimary: "", imgSecondary: "" });
      await getProducts();
      onClose();
    } catch (error) {
      console.error(error);
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
            <FormControl><FormLabel>Código</FormLabel><Input name="code" value={newProduct.code} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>Nombre</FormLabel><Input name="name" value={newProduct.name} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>Descripción</FormLabel><Input name="description" value={newProduct.description} onChange={handleChange} /></FormControl>

            {/* Precios */}
            <HStack>
              <FormControl><FormLabel>Precio Mínimo</FormLabel>
                <NumberInput min={0} value={newProduct.priceMin} onChange={(v)=>handleNumberChange("priceMin",v)}><NumberInputField/></NumberInput>
              </FormControl>
              <FormControl><FormLabel>Precio Mayorista</FormLabel>
                <NumberInput min={0} value={newProduct.priceMay} onChange={(v)=>handleNumberChange("priceMay",v)}><NumberInputField/></NumberInput>
              </FormControl>
            </HStack>

            {/* Dimensiones */}
            <HStack>
              <FormControl><FormLabel>Alto (cm)</FormLabel>
                <NumberInput min={0} value={newProduct.height} onChange={(v)=>handleNumberChange("height",v)}><NumberInputField/></NumberInput>
              </FormControl>
              <FormControl><FormLabel>Ancho (cm)</FormLabel>
                <NumberInput min={0} value={newProduct.width} onChange={(v)=>handleNumberChange("width",v)}><NumberInputField/></NumberInput>
              </FormControl>
            </HStack>
            <HStack>
              <FormControl><FormLabel>Profundidad (cm)</FormLabel>
                <NumberInput min={0} value={newProduct.depth} onChange={(v)=>handleNumberChange("depth",v)}><NumberInputField/></NumberInput>
              </FormControl>
              <FormControl><FormLabel>Peso (kg)</FormLabel>
                <NumberInput min={0} value={newProduct.weith} onChange={(v)=>handleNumberChange("weith",v)}><NumberInputField/></NumberInput>
              </FormControl>
            </HStack>

            {/* Selects */}
            <FormControl>
              <FormLabel>Estilo</FormLabel>
              <Select placeholder="Seleccionar estilo" value={newProduct.style?.[0]||""} onChange={(e)=>handleSelectChange("style",e.target.value)}>
                {(productOptions.styleOptions||[]).map(s=><option key={s} value={s}>{s}</option>)}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select placeholder="Seleccionar categoría" value={newProduct.category?.[0]||""} onChange={(e)=>handleSelectChange("category",e.target.value)}>
                {(productOptions.categoryOptions||[]).map(c=><option key={c} value={c}>{c}</option>)}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Material</FormLabel>
              <Select placeholder="Seleccionar material" value={newProduct.material?.[0]||""} onChange={(e)=>handleSelectChange("material",e.target.value)}>
                {(productOptions.materialOptions||[]).map(m=><option key={m} value={m}>{m}</option>)}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Elemento asociado</FormLabel>
              <Select placeholder="Seleccionar elemento" value={newProduct.elements?.[0]||""} onChange={(e)=>handleSelectChange("elements",e.target.value)}>
                {(productOptions.elementOptions||[]).map(el=><option key={el} value={el}>{el}</option>)}
              </Select>
            </FormControl>

            {/* Colores */}
            <FormControl>
              <FormLabel>Agregar color</FormLabel>
              <HStack>
                <Select placeholder={colorList.length?"Seleccionar color":"No hay colores"} value={selectedColor} onChange={e=>setSelectedColor(e.target.value)} isDisabled={!colorList.length}>
                  {colorList.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
                <NumberInput min={1} value={colorStock} onChange={v=>setColorStock(Number(v)||0)} w="110px"><NumberInputField/></NumberInput>
                <IconButton icon={<FiPlus/>} aria-label="Agregar color" colorScheme="pink" onClick={handleAddColor}/>
              </HStack>
              <VStack align="stretch" mt={2}>
                {(newProduct.colors||[]).map((c,i)=>(
                  <HStack key={i} justify="space-between">
                    <HStack>
                      <Box w="20px" h="20px" bg={COLOR_HEX_MAP[c.name?.toLowerCase()]||"#ccc"} border="1px solid #999" borderRadius="sm"/>
                      <Text>{c.name} — Stock: {c.stock}</Text>
                    </HStack>
                    <IconButton icon={<FiTrash2/>} size="sm" onClick={()=>handleRemoveColor(i)}/>
                  </HStack>
                ))}
                {(!newProduct.colors||!newProduct.colors.length) && <Text color="gray.500" fontSize="sm">No hay colores agregados</Text>}
              </VStack>
            </FormControl>

            {/* Imágenes */}
            {["imgPrimary","imgSecondary"].map(field=>(
              <FormControl key={field}>
                <FormLabel>{field==="imgPrimary"?"Imagen Principal":"Imagen Secundaria"}</FormLabel>
                <Input type="file" accept="image/*" onChange={e=>handleFileChange(e.target.files[0],field)}/>
                {previews[field] && (
                  <Box position="relative" w="150px" mt={2}>
                    <Image src={previews[field]} boxSize="150px" objectFit="cover" borderRadius="md"/>
                    <IconButton icon={<FiX/>} size="sm" position="absolute" top="2px" right="2px" colorScheme="red" onClick={()=>handleRemoveFile(field)}/>
                  </Box>
                )}
              </FormControl>
            ))}

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