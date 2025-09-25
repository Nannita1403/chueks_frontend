import { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, VStack, FormControl, FormLabel, Input, Select, Box, Text
} from "@chakra-ui/react";

export default function PhoneModal({ isOpen, onClose, onSave, initialValue = [] }) {
  const [phones, setPhones] = useState([]);
  const [newPhone, setNewPhone] = useState({ number: "", country: "ES" });

  useEffect(() => {
    if (isOpen) setPhones(initialValue);
  }, [isOpen, initialValue]);

  const handleAdd = () => {
    if (!newPhone.number.trim()) return;
    setPhones([...phones, { ...newPhone, id: Date.now() }]);
    setNewPhone({ number: "", country: "ES" });
  };

  const handleSave = () => {
    onSave(phones);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Teléfonos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={3} align="stretch">
            {phones.map((p, i) => (
              <Box key={i} p={2} borderWidth="1px" borderRadius="md">
                <Text>{p.number} ({p.country})</Text>
              </Box>
            ))}
            <FormControl>
              <FormLabel>Número</FormLabel>
              <Input
                value={newPhone.number}
                onChange={(e) => setNewPhone({ ...newPhone, number: e.target.value })}
                placeholder="+34 600 123 456"
              />
            </FormControl>
            <FormControl>
              <FormLabel>País</FormLabel>
              <Select
                value={newPhone.country}
                onChange={(e) => setNewPhone({ ...newPhone, country: e.target.value })}
              >
                <option value="ES">España</option>
                <option value="AR">Argentina</option>
              </Select>
            </FormControl>
            <Button size="sm" colorScheme="blue" onClick={handleAdd}>Agregar</Button>
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
