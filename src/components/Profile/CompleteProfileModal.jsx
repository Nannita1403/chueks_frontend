import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button,
  FormControl, FormLabel, Input
} from "@chakra-ui/react";
import { useState } from "react";

export default function CompleteProfileModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    zip: "",
    telephone: "", // temporal, se transformará a telephones al enviar
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      name: formData.name,
      telephones: formData.telephone ? [{ number: formData.telephone, label: "personal" }] : [],
      address: formData.street && formData.city && formData.zip ? {
        street: formData.street,
        city: formData.city,
        zip: formData.zip
      } : null
    };
    onSave(payload);
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
            <Input name="street" placeholder="Calle" value={formData.street} onChange={handleChange} />
            <Input name="city" placeholder="Ciudad" mt={2} value={formData.city} onChange={handleChange} />
            <Input name="zip" placeholder="Código Postal" mt={2} value={formData.zip} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Teléfono</FormLabel>
            <Input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+34 600 123 456" />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>Guardar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
