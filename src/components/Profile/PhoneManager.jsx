import { useEffect, useState } from "react";
import {
  Box, Button, Input, VStack, Text, FormControl,
  FormLabel, Select, HStack, Divider
} from "@chakra-ui/react";

export default function PhoneManager({
  initialValue = [],
  onChange,
  onUpdate,
  onDelete
}) {
  const [phones, setPhones] = useState([]);
  const [newPhone, setNewPhone] = useState({ number: "", country: "ES" });

  useEffect(() => {
    setPhones(initialValue);
  }, [initialValue]);

  const isValid = (phone) => phone.number?.trim();

  const handleAdd = () => {
    if (!isValid(newPhone)) return;

    const alreadyExists = phones.some(p => p.number === newPhone.number);
    if (alreadyExists) return;

    const newEntry = { ...newPhone, _tempId: Date.now() };
    const updated = [...phones, newEntry];
    setPhones(updated);
    onChange?.(updated);
    setNewPhone({ number: "", country: "ES" });
  };

  const handleRemove = async (id) => {
    const isServerId = typeof id === "string";
    if (isServerId && onDelete) await onDelete(id);

    const updated = phones.filter(p => p._id !== id && p._tempId !== id);
    setPhones(updated);
    onChange?.(updated);
  };

  const handleUpdate = async (id, field, value) => {
    const updated = phones.map(p =>
      p._id === id || p._tempId === id ? { ...p, [field]: value } : p
    );
    setPhones(updated);
    onChange?.(updated);

    const updatedPhone = updated.find(p => p._id === id || p._tempId === id);
    if (updatedPhone._id && onUpdate) {
      const { _id, ...rest } = updatedPhone;
      await onUpdate(_id, rest);
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      {phones.map((p) => {
        const id = p._id || p._tempId;
        return (
          <Box key={id} p={3} borderWidth="1px" borderRadius="md">
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold">Teléfono</Text>
                <Button
                  size="xs"
                  colorScheme="red"
                  onClick={() => handleRemove(p._id || p._tempId)}
                >
                  Eliminar
                </Button>
              </HStack>
              <Input
                size="sm"
                value={p.number}
                onChange={(e) => handleUpdate(id, "number", e.target.value)}
                placeholder="Ej: +34 600 123 456"
              />
              <Select
                size="sm"
                value={p.country}
                onChange={(e) => handleUpdate(id, "country", e.target.value)}
              >
                <option value="ES">España</option>
                <option value="AR">Argentina</option>
              </Select>
            </VStack>
          </Box>
        );
      })}

      <Divider />
      <Text fontWeight="bold">Agregar nuevo teléfono</Text>

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

      <Button onClick={handleAdd} colorScheme="blue">
        Agregar teléfono
      </Button>
    </VStack>
  );
}
