// PhoneModal.jsx
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button
} from "@chakra-ui/react";
import PhoneManager from "./PhoneManager";

export default function PhoneModal({ isOpen, onClose, onSave, initialValue = [] }) {
  let tempPhones = initialValue;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Teléfonos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <PhoneManager
            initialValue={initialValue}
            onChange={(val) => (tempPhones = val)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>Cancelar</Button>
          <Button
            colorScheme="green"
            onClick={() => {
              onSave?.(tempPhones);
              onClose();
            }}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
