import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { useRef } from "react";
import AddressManager from "./AddressManager";

export default function AddressModal({
  isOpen,
  onClose,
  initialValue = [],
  onSave,
  onUpdate,
  deleteAddress
}) {
  const tempAddresses = useRef(initialValue);
  const handleChange = (updated) => {
    tempAddresses.current = updated;
  };

  const handleSave = () => {
    onSave?.(tempAddresses.current);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Direcciones</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AddressManager
            initialValue={initialValue}
            onChange={handleChange}
            onUpdate={onUpdate}
            onDelete={deleteAddress}
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
