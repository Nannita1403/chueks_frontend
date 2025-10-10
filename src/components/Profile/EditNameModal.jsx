import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Input, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function EditNameModal({ isOpen, onClose, onSave, initialValue }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialValue || "");
    }
  }, [isOpen, initialValue]);

    const handleSave = () => {
    console.log(data)
    if (onSave) onSave(name);  
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Nombre</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Nuevo nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
