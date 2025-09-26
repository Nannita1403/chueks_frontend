import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function EditLastNameModal({ isOpen, onClose, onSave, initialValue }) {
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (isOpen) setLastName(initialValue || "");
  }, [isOpen, initialValue]);

  const handleSave = () => {
    if (onSave) onSave(lastName); 
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Apellido</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Nuevo apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>Cancelar</Button>
          <Button colorScheme="blue" onClick={handleSave}>Guardar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
