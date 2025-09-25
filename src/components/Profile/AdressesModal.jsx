import { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, VStack, Input, Box, Text
} from "@chakra-ui/react";

export default function AddressModal({ isOpen, onClose, onSave, initialValue = [] }) {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    if (isOpen) setAddresses(initialValue);
  }, [isOpen, initialValue]);

  const handleAdd = () => {
    if (!newAddress.trim()) return;
    setAddresses([...addresses, newAddress.trim()]);
    setNewAddress("");
  };

  const handleSave = () => {
    onSave(addresses);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Direcciones</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={3} align="stretch">
            {addresses.map((addr, i) => (
              <Box key={i} p={2} borderWidth="1px" borderRadius="md">
                <Text>{addr}</Text>
              </Box>
            ))}
            <Input
              placeholder="Nuevo domicilio"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <Button onClick={handleAdd} colorScheme="blue" size="sm">Agregar</Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>Cancelar</Button>
          <Button colorScheme="green" onClick={handleSave}>Guardar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
