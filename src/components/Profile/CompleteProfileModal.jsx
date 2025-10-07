import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react";
import {   useDisclosure, useEffect, useState } from "react";

export default function CompleteProfileModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    zip: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Completa tu perfil</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Nombre</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Dirección</FormLabel>
            <Input name="street" placeholder="Calle" onChange={handleChange} />
            <Input name="city" placeholder="Ciudad" mt={2} onChange={handleChange} />
            <Input name="zip" placeholder="Código Postal" mt={2} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Teléfono</FormLabel>
            <Input name="phone" onChange={handleChange} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
