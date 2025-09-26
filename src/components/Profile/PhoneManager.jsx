import { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Text, FormControl, FormLabel, Select } from "@chakra-ui/react";

export default function PhoneManager({ initialValue = [], onChange }) {
  const [phones, setPhones] = useState([]);
  const [newPhone, setNewPhone] = useState({ number: "", country: "ES" });

  useEffect(() => {
    setPhones(initialValue);
  }, [initialValue]);

  const addPhone = () => {
    if (!newPhone.number.trim()) return;
    const updated = [...phones, { ...newPhone, id: Date.now() }];
    setPhones(updated);
    setNewPhone({ number: "", country: "ES" });
    onChange?.(updated);
  };

  const removePhone = (id) => {
    const updated = phones.filter((p) => p.id !== id);
    setPhones(updated);
    onChange?.(updated);
  };

  return (
    <VStack align="stretch" spacing={3}>
      {phones.map((p) => (
        <Box key={p.id} p={3} borderWidth="1px" borderRadius="md">
          <Text>{p.number} ({p.country})</Text>
          <Button mt={2} size="xs" colorScheme="red" onClick={() => removePhone(p.id)}>
            Eliminar
          </Button>
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

      <Button onClick={addPhone} colorScheme="blue">Agregar Teléfono</Button>
    </VStack>
  );
}
