import React, { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, VStack, HStack, Select, Text, IconButton, Box, Input
} from "@chakra-ui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { useToast } from "../../Hooks/useToast.jsx";

const AddElementsModal = ({ isOpen, onClose, product, setProduct }) => {
  const { toast } = useToast();

  const [element, setElement] = useState({
    name: "",
    type: "",
    color: "",
    material: "",
    style: "",
    extInt: "",
    quantity: "1"
  });

  const [elementOptions, setElementOptions] = useState({
    typeOptions: [], colorOptions: [], materialOptions: [], styleOptions: [], extIntOptions: []
  });

  // Traer elementos y generar opciones dinámicas
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const { data } = await axios.get("https://chueks-backend.vercel.app/api/v1/elements");
        
        setElementOptions({
          typeOptions: [...new Set(data.flatMap(e => e.type ? [e.type] : []))],
          colorOptions: [...new Set(data.flatMap(e => e.color ? [e.color] : []))],
          materialOptions: [...new Set(data.flatMap(e => e.material ? [e.material] : []))],
          styleOptions: [...new Set(data.flatMap(e => e.style ? [e.style] : []))],
          extIntOptions: [...new Set(data.flatMap(e => e.extInt ? [e.extInt] : []))]
        });
      } catch (err) {
        console.error(err);
        toast({ title: "Error cargando opciones", status: "error" });
      }
    };
    loadOptions();
  }, [toast]);

  const handleChange = (field, value) => setElement(prev => ({ ...prev, [field]: value }));

  // Guardar elemento y devolver su _id
  const handleAddElement = async () => {
    if (!element.name.trim()) {
      return toast({ title: "El nombre es obligatorio", status: "warning" });
    }

    try {
      // Crear elemento en backend
      const { data: newElement } = await axios.post(
        "https://chueks-backend.vercel.app/api/v1/elements",
        element
      );

      // Agregarlo al producto actual
      const updatedProduct = {
        ...product,
        elements: [...(product.elements || []), { quantity: element.quantity || "1", element: newElement }]
      };

      // Guardar producto actualizado en backend
      await axios.put(`https://chueks-backend.vercel.app/api/v1/products/${product._id}`, updatedProduct);

      // Actualizar estado en el front
      setProduct(updatedProduct);

      setElement({ name: "", type: "", color: "", material: "", style: "", extInt: "", quantity: "1" });
      toast({ title: "Elemento agregado al producto", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error al agregar elemento", status: "error" });
    }
  };

  const handleRemoveElement = (idx) => {
    setProduct(prev => {
      const updated = [...(prev.elements || [])];
      updated.splice(idx, 1);
      return { ...prev, elements: updated };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Elementos a {product?.name}</ModalHeader>
        <ModalBody>
          <VStack spacing={3} align="stretch">
            <HStack gap={2}>
              <Input
                placeholder="Nombre del elemento"
                value={element.name}
                onChange={e => handleChange("name", e.target.value)}
              />
              <Input
                placeholder="Cantidad"
                type="number"
                min="1"
                w="80px"
                value={element.quantity}
                onChange={e => handleChange("quantity", e.target.value)}
              />
              <IconButton icon={<FiPlus />} colorScheme="pink" onClick={handleAddElement} />
            </HStack>

            <HStack spacing={2}>
              <Select placeholder="Tipo" value={element.type} onChange={e => handleChange("type", e.target.value)}>
                {elementOptions.typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </Select>

              <Select placeholder="Color" value={element.color} onChange={e => handleChange("color", e.target.value)}>
                {elementOptions.colorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </Select>

              <Select placeholder="Material" value={element.material} onChange={e => handleChange("material", e.target.value)}>
                {elementOptions.materialOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </Select>
            </HStack>

            <HStack spacing={2}>
              <Select placeholder="Estilo" value={element.style} onChange={e => handleChange("style", e.target.value)}>
                {elementOptions.styleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </Select>

              <Select placeholder="Interno/Externo" value={element.extInt} onChange={e => handleChange("extInt", e.target.value)}>
                {elementOptions.extIntOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </Select>
            </HStack>

            <VStack spacing={2} align="stretch">
              {(product.elements || []).map((el, i) => (
                <HStack key={i} justify="space-between" bg="gray.50" p={2} borderRadius="md">
                  <Box>
                    <Text fontWeight="bold">{el.element.name || el.element}</Text>
                    {el.element.type && <Text fontSize="sm">Tipo: {el.element.type}</Text>}
                    {el.element.color && <Text fontSize="sm">Color: {el.element.color}</Text>}
                    {el.element.material && <Text fontSize="sm">Material: {el.element.material}</Text>}
                    {el.element.style && <Text fontSize="sm">Estilo: {el.element.style}</Text>}
                    {el.element.extInt && <Text fontSize="sm">Interno/Externo: {el.element.extInt}</Text>}
                    <Text fontSize="sm">Cantidad: {el.quantity}</Text>
                  </Box>
                  <IconButton icon={<FiTrash2 />} size="sm" onClick={() => handleRemoveElement(i)} />
                </HStack>
              ))}
              {(!product.elements || !product.elements.length) && (
                <Text color="gray.500" fontSize="sm">No hay elementos agregados</Text>
              )}
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddElementsModal;
