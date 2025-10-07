import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button
} from "@chakra-ui/react";
import { useRef } from "react";
import PhoneManager from "./PhoneManager";

export default function PhoneModal({
  isOpen,
  onClose,
  initialValue = [],
  onSave,
  onUpdate,
  deletePhone
}) {
  const tempPhones = useRef(initialValue);

  const handleChange = (updated) => {
    tempPhones.current = updated;
  };

  const handleSave = () => {
    onSave?.(tempPhones.current);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Teléfonos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PhoneManager
            initialValue={initialValue}
            onChange={handleChange}
            onUpdate={onUpdate}
            onDelete={deletePhone}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>Cancelar</Button>
          <Button colorScheme="green" onClick={handleSave}>Guardar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
