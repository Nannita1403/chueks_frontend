import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Select,
  HStack,
  Divider,
  useToast
} from "@chakra-ui/react";
import { editUserField } from "../Profile/userService.jsx";

export default function PhoneManager({ initialValue = [], onChange }) {
  const [telephones, setTelephones] = useState([]);
  const [newTelephone, setNewTelephone] = useState({ number: "", label: "personal" });
  const toast = useToast();

  useEffect(() => setTelephones(initialValue), [initialValue]);

  const isValid = (t) => t.number?.trim();

  const handleAdd = async () => {
    if (!isValid(newTelephone)) {
      toast({ title: "Número inválido", status: "warning" });
      return;
    }

    try {
      const res = await editUserField("telephone", "add", newTelephone);
      setTelephones(res.user.telephones);
      onChange?.(res.user.telephones);
      toast({ title: "Teléfono agregado", status: "success" });
      setNewTelephone({ number: "", label: "personal" });
    } catch (err) {
      toast({
        title: "Error al agregar teléfono",
        description: err.message,
        status: "error"
      });
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await editUserField("telephone", "delete", {}, id);
      setTelephones(res.user.telephones);
      onChange?.(res.user.telephones);
      toast({ title: "Teléfono eliminado", status: "info" });
    } catch (err) {
      toast({
        title: "Error al eliminar teléfono",
        description: err.message,
        status: "error"
      });
    }
  };

  const handleUpdate = async (id, field, value) => {
    const updated = telephones.map((t) =>
      t._id === id ? { ...t, [field]: value } : t
    );
    setTelephones(updated);

    const telToUpdate = updated.find((t) => t._id === id);
    try {
      const res = await editUserField("telephone", "update", telToUpdate, id);
      setTelephones(res.user.telephones);
      toast({ title: "Teléfono actualizado", status: "success" });
    } catch (err) {
      toast({
        title: "Error al actualizar teléfono",
        description: err.message,
        status: "error"
      });
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      {telephones.map((p) => (
        <Box key={p._id || p._tempId} p={3} borderWidth="1px" borderRadius="md">
          <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">Teléfono</Text>
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => handleRemove(p._id)}
              >
                Eliminar
              </Button>
            </HStack>
            <Input
              size="sm"
              value={p.number}
              onChange={(e) => handleUpdate(p._id, "number", e.target.value)}
              placeholder="Número"
            />
            <Select
              size="sm"
              value={p.label}
              onChange={(e) => handleUpdate(p._id, "label", e.target.value)}
            >
              <option value="personal">Personal</option>
              <option value="work">Trabajo</option>
            </Select>
          </VStack>
        </Box>
      ))}

      <Divider />
      <Text fontWeight="bold">Agregar nuevo teléfono</Text>

      <FormControl>
        <FormLabel>Número</FormLabel>
        <Input
          value={newTelephone.number}
          onChange={(e) =>
            setNewTelephone({ ...newTelephone, number: e.target.value })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel>Etiqueta</FormLabel>
        <Select
          value={newTelephone.label}
          onChange={(e) =>
            setNewTelephone({ ...newTelephone, label: e.target.value })
          }
        >
          <option value="personal">Personal</option>
          <option value="work">Trabajo</option>
        </Select>
      </FormControl>

      <Button onClick={handleAdd} colorScheme="blue">
        Agregar teléfono
      </Button>
    </VStack>
  );
}
