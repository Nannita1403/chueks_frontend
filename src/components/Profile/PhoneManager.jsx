import { useEffect, useState } from "react";
import { Box, Button, Input, VStack, Text, FormControl, FormLabel, Select, HStack, Divider } from "@chakra-ui/react";

export default function PhoneManager({ initialValue = [], onChange, onUpdate, onDelete }) {
  const [telephones, setTelephones] = useState([]);
  const [newTelephone, setNewTelephone] = useState({ number: "", label: "personal" });

  useEffect(() => setTelephones(initialValue), [initialValue]);

  const isValid = (t) => t.number?.trim();

  const handleAdd = () => {
    if (!isValid(newTelephone)) return;
    if (telephones.some(p => p.number === newTelephone.number)) return;

    const newEntry = { ...newTelephone, _tempId: Date.now() };
    const updated = [...telephones, newEntry];
    setTelephones(updated);
    onChange?.(updated);
    setNewTelephone({ number: "", label: "personal" });
  };

  const handleRemove = async (id) => {
    if (typeof id === "string" && onDelete) await onDelete(id);
    setTelephones(telephones.filter(p => p._id !== id && p._tempId !== id));
    onChange?.(telephones.filter(p => p._id !== id && p._tempId !== id));
  };

  const handleUpdate = async (id, field, value) => {
    const updated = telephones.map(p => (p._id === id || p._tempId === id ? { ...p, [field]: value } : p));
    setTelephones(updated);
    onChange?.(updated);

    const updatedTelephone = updated.find(p => p._id === id || p._tempId === id);
    if (updatedTelephone._id && onUpdate) {
      const { _id, ...rest } = updatedTelephone;
      await onUpdate(_id, rest);
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      {telephones.map(p => {
        const id = p._id || p._tempId;
        return (
          <Box key={id} p={3} borderWidth="1px" borderRadius="md">
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold">Teléfono</Text>
                <Button size="xs" colorScheme="red" onClick={() => handleRemove(id)}>Eliminar</Button>
              </HStack>
              <Input size="sm" value={p.number} onChange={e => handleUpdate(id, "number", e.target.value)} />
              <Select size="sm" value={p.label} onChange={e => handleUpdate(id, "label", e.target.value)}>
                <option value="personal">Personal</option>
                <option value="work">Trabajo</option>
              </Select>
            </VStack>
          </Box>
        );
      })}

      <Divider />
      <Text fontWeight="bold">Agregar nuevo teléfono</Text>

      <FormControl>
        <FormLabel>Número</FormLabel>
        <Input value={newTelephone.number} onChange={e => setNewTelephone({ ...newTelephone, number: e.target.value })} />
      </FormControl>

      <FormControl>
        <FormLabel>Etiqueta</FormLabel>
        <Select value={newTelephone.label} onChange={e => setNewTelephone({ ...newTelephone, label: e.target.value })}>
          <option value="personal">Personal</option>
          <option value="work">Trabajo</option>
        </Select>
      </FormControl>

      <Button onClick={handleAdd} colorScheme="blue">Agregar teléfono</Button>
    </VStack>
  );
}
