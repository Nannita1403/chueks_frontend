import React from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  Button, VStack, HStack, FormControl, FormLabel, Input, NumberInput, NumberInputField,
  Select, IconButton, useToast
} from "@chakra-ui/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import ProductsActions from "../../reducers/products/products.actions.jsx";

const EditProductModal = ({ isOpen, onClose, currentProduct, setCurrentProduct, productOptions }) => {
  const toast = useToast();

  if (!currentProduct) return null;

  const handleChange = (e) => setCurrentProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleArrayChange = (field, value) => setCurrentProduct(prev => ({ ...prev, [field]: value }));

  const handleAddColor = () => setCurrentProduct(prev => ({ ...prev, colors: [...(prev.colors || []), { name: [], stock: 0 }] }));
  const handleRemoveColor = (idx) => {
    const updated = [...(currentProduct.colors || [])];
    updated.splice(idx, 1);
    setCurrentProduct(prev => ({ ...prev, colors: updated }));
  };
  const handleColorChange = (idx, value) => {
    const updated = [...(currentProduct.colors || [])];
    updated[idx].name = value;
    setCurrentProduct(prev => ({ ...prev, colors: updated }));
  };

  const handleUpdate = async () => {
    try {
      await ProductsActions.updateProduct(currentProduct._id, currentProduct);
      toast({ title: "Producto actualizado", status: "success", duration: 3000 });
      onClose();
    } catch (error) {
      toast({ title: "Error al actualizar", status: "error", duration: 3000 });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Producto: {currentProduct.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl><FormLabel>Código</FormLabel><Input name="code" value={currentProduct.code || ""} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>Nombre</FormLabel><Input name="name" value={currentProduct.name || ""} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>Descripción</FormLabel><Input name="description" value={currentProduct.description || ""} onChange={handleChange} /></FormControl>

            <HStack>
              <FormControl>
                <FormLabel>Precio Mínimo</FormLabel>
                <NumberInput value={currentProduct.priceMin || 0} onChange={(v) => handleChange({ target: { name: "priceMin", value: Number(v) }})}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Precio Máximo</FormLabel>
                <NumberInput value={currentProduct.priceMay || 0} onChange={(v) => handleChange({ target: { name: "priceMay", value: Number(v) }})}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Estilo</FormLabel>
              <Select multiple value={currentProduct.style || []} onChange={e => handleArrayChange("style", Array.from(e.target.selectedOptions, o => o.value))}>
                {(productOptions.styleOptions || []).map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select multiple value={currentProduct.category || []} onChange={e => handleArrayChange("category", Array.from(e.target.selectedOptions, o => o.value))}>
                {(productOptions.categoryOptions || []).map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Material</FormLabel>
              <Select multiple value={currentProduct.material || []} onChange={e => handleArrayChange("material", Array.from(e.target.selectedOptions, o => o.value))}>
                {(productOptions.materialOptions || []).map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Colores</FormLabel>
              <VStack spacing={2} align="stretch">
                {(currentProduct.colors || []).map((c, idx) => (
                  <HStack key={idx}>
                    <Select multiple value={c.name || []} onChange={e => handleColorChange(idx, Array.from(e.target.selectedOptions, o => o.value))}>
                      {(productOptions.colorOptions || []).map(color => <option key={color} value={color}>{color}</option>)}
                    </Select>
                    <NumberInput value={c.stock || 0} onChange={v => {
                      const updated = [...(currentProduct.colors || [])]; updated[idx].stock = Number(v);
                      setCurrentProduct(prev => ({ ...prev, colors: updated }));
                    }}>
                      <NumberInputField />
                    </NumberInput>
                    <IconButton icon={<FiTrash2 />} onClick={() => handleRemoveColor(idx)} />
                  </HStack>
                ))}
                <Button leftIcon={<FiPlus />} onClick={handleAddColor}>Agregar Color</Button>
              </VStack>
            </FormControl>

            <HStack>
              <FormControl><FormLabel>Alto</FormLabel><NumberInput value={currentProduct.height || 0} onChange={(v) => handleChange({ target: { name:"height", value:Number(v) }})}><NumberInputField /></NumberInput></FormControl>
              <FormControl><FormLabel>Ancho</FormLabel><NumberInput value={currentProduct.width || 0} onChange={(v) => handleChange({ target: { name:"width", value:Number(v) }})}><NumberInputField /></NumberInput></FormControl>
              <FormControl><FormLabel>Profundidad</FormLabel><NumberInput value={currentProduct.depth || 0} onChange={(v) => handleChange({ target: { name:"depth", value:Number(v) }})}><NumberInputField /></NumberInput></FormControl>
            </HStack>

            <FormControl><FormLabel>Imagen Principal (URL)</FormLabel><Input name="imgPrimary" value={currentProduct.imgPrimary || ""} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>Imagen Secundaria (URL)</FormLabel><Input name="imgSecondary" value={currentProduct.imgSecondary || ""} onChange={handleChange} /></FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="pink" onClick={handleUpdate}>Guardar Cambios</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProductModal;
