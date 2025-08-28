import React from "react"
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
} from "@chakra-ui/react"
import { FiPlus, FiTrash2 } from "react-icons/fi"
import ProductsActions from "../../reducers/products/products.actions.jsx"
import { useToast } from "@/Hooks/useToast"


const styleOptions = ["Urbana", "Fiesta", "Noche", "Casual", "Diario", "Ejecutivo", "Trabajo", "Viaje", "Playa", "Deporte"]
const categoryOptions = ["Tarjetero","Cartera", "Tote", "Clutch", "Mochila", "Bolso", "ShoulderBag/Hombro", "Mini Bag", "Crossbody/Bandolera","Clutch/Sobre", "Riñonera", "Matera", "Billetera", "Accesorios", "Neceser"]
const materialOptions = ["cuero", "tela Andorra", "símil cuero", "sublimado CHUEKS", "tela puffer","metálico", "resina", "plastico", "tela","iman","tafeta negra", "grabado laser", "símil cuero rígido", "neoprene", "nylon", "sublimda", ""]
const colorOptions = ["lila", "verde", "animal print", "suela", "nude", "blanca","beige","rose gold", "negro", "glitter dorada", "dorada", "borgoña","habano", "cobre", "peltre", "crema", "celeste", "plateada","vison", "verde oliva", "cristal", "negro opaco", "negro croco", "negro con crudo"]

const CreateProductModal = ({ isOpen, onClose, newProduct, setNewProduct, productOptions }) => {
  const toast = useToast();

  const handleChange = (e) => setNewProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleArrayChange = (field, value) => setNewProduct(prev => ({ ...prev, [field]: value }));

  const handleAddColor = () => setNewProduct(prev => ({ ...prev, colors: [...(prev.colors || []), { name: [], stock: 0 }] }));
  const handleRemoveColor = (idx) => {
    const updated = [...(newProduct.colors || [])]; updated.splice(idx, 1);
    setNewProduct(prev => ({ ...prev, colors: updated }));
  };
  const handleColorChange = (idx, value) => {
    const updated = [...(newProduct.colors || [])]; updated[idx].name = value;
    setNewProduct(prev => ({ ...prev, colors: updated }));
  };

  const handleCreate = async () => {
    try {
      await ProductsActions.createProduct(newProduct);
      toast({ title: "Producto creado", status: "success", duration: 3000 });
      onClose();
      setNewProduct({ code:"", name:"", style:[], description:"", priceMin:0, priceMay:0, likes:[], elements:[], category:[], material:[], colors:[], height:0, width:0, depth:0, imgPrimary:"", imgSecondary:"" });
    } catch {
      toast({ title: "Error al crear producto", status: "error", duration: 3000 });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl><FormLabel>Código</FormLabel><Input name="code" value={newProduct.code} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>Nombre</FormLabel><Input name="name" value={newProduct.name} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>Descripción</FormLabel><Input name="description" value={newProduct.description} onChange={handleChange} /></FormControl>

            <HStack>
              <FormControl><FormLabel>Precio Mínimo</FormLabel>
                <NumberInput value={newProduct.priceMin} onChange={(v) => handleChange({ target: { name:"priceMin", value:Number(v) }})}><NumberInputField /></NumberInput>
              </FormControl>
              <FormControl><FormLabel>Precio Máximo</FormLabel>
                <NumberInput value={newProduct.priceMay} onChange={(v) => handleChange({ target: { name:"priceMay", value:Number(v) }})}><NumberInputField /></NumberInput>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Estilo</FormLabel>
              <Select multiple value={newProduct.style} onChange={e => handleArrayChange("style", Array.from(e.target.selectedOptions, o => o.value))}>
                {(productOptions.styleOptions || []).map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select multiple value={newProduct.category} onChange={e => handleArrayChange("category", Array.from(e.target.selectedOptions, o => o.value))}>
                {(productOptions.categoryOptions || []).map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Material</FormLabel>
              <Select multiple value={newProduct.material} onChange={e => handleArrayChange("material", Array.from(e.target.selectedOptions, o => o.value))}>
                {(productOptions.materialOptions || []).map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Colores</FormLabel>
              <VStack spacing={2} align="stretch">
                {(newProduct.colors || []).map((c, idx) => (
                  <HStack key={idx}>
                    <Select multiple value={c.name} onChange={e => handleColorChange(idx, Array.from(e.target.selectedOptions, o => o.value))}>
                      {(productOptions.colorOptions || []).map(color => <option key={color} value={color}>{color}</option>)}
                    </Select>
                    <NumberInput value={c.stock || 0} onChange={v => {
                      const updated = [...(newProduct.colors || [])]; updated[idx].stock = Number(v);
                      setNewProduct(prev => ({ ...prev, colors: updated }));
                    }}><NumberInputField /></NumberInput>
                    <IconButton icon={<FiTrash2 />} onClick={() => handleRemoveColor(idx)} />
                  </HStack>
                ))}
                <Button leftIcon={<FiPlus />} onClick={handleAddColor}>Agregar Color</Button>
              </VStack>
            </FormControl>

            <HStack>
              <FormControl><FormLabel>Alto</FormLabel><NumberInput value={newProduct.height} onChange={(v) => handleChange({ target: { name:"height", value:Number(v) }})}><NumberInputField /></NumberInput></FormControl>
              <FormControl><FormLabel>Ancho</FormLabel><NumberInput value={newProduct.width} onChange={(v) => handleChange({ target: { name:"width", value:Number(v) }})}><NumberInputField /></NumberInput></FormControl>
              <FormControl><FormLabel>Profundidad</FormLabel><NumberInput value={newProduct.depth} onChange={(v) => handleChange({ target: { name:"depth", value:Number(v) }})}><NumberInputField /></NumberInput></FormControl>
            </HStack>

            <FormControl><FormLabel>Imagen Principal (URL)</FormLabel><Input name="imgPrimary" value={newProduct.imgPrimary} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>Imagen Secundaria (URL)</FormLabel><Input name="imgSecondary" value={newProduct.imgSecondary} onChange={handleChange} /></FormControl>
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
