// AddressModal.jsx
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button
} from "@chakra-ui/react";
import AddressManager from "./AddressManager";

export default function AddressModal({ isOpen, onClose, onSave, initialValue = [] }) {
  let tempAddresses = initialValue;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Direcciones</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AddressManager
            initialValue={initialValue}
            onChange={(val) => (tempAddresses = val)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>Cancelar</Button>
          <Button
            colorScheme="green"
            onClick={() => {
              onSave?.(tempAddresses);
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
