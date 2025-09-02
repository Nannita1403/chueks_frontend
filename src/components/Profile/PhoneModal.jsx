// src/pages/Profile/modals/PhoneModal.jsx
import { useState } from "react";
import {
  Button, VStack, HStack, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  FormControl, FormLabel, Input, Select
} from "@chakra-ui/react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const PhoneModal = ({ isOpen, onClose }) => {
  const [phones, setPhones] = useState([]);
  const [form, setForm] = useState({ number: "", country: "ES" });
  const [editId, setEditId] = useState(null);

  const validatePhone = (number, country) => {
    const phone = parsePhoneNumberFromString(number, country);
    return phone?.isValid() || false;
  };

  const handleSave = () => {
    if (!validatePhone(form.number, form.country)) {
      alert("El número de teléfono no es válido para el país seleccionado.");
      return;
    }

    if (editId) {
      setPhones(phones.map(p => p.id === editId ? { ...form, id: editId } : p));
    } else {
      setPhones([...phones, { ...form, id: Date.now() }]);
    }

    setForm({ number: "", country: "ES" });
    setEditId(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editId ? "Editar teléfono" : "Nuevo teléfono"}</ModalHeader>
        <ModalBody>
          <VStack spacing={3}>
            <FormControl>
              <FormLabel>Número</FormLabel>
              <Input
                value={form.number}
                onChange={e => setForm({ ...form, number: e.target.value })}
                placeholder="+34 600 123 456"
              />
            </FormControl>
            <FormControl>
              <FormLabel>País</FormLabel>
              <Select
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
              >
                <option value="ES">España</option>
                <option value="AR">Argentina</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="pink" onClick={handleSave}>Guardar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PhoneModal;
