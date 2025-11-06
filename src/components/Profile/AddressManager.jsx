import { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Text, FormControl, FormLabel, Select, HStack, Divider, useToast } from "@chakra-ui/react";
import { editUserField } from "../Profile/userService.jsx";

export default function AddressManager({ initialValue = [], onChange }) {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ street: "", city: "", zip: "", country: "ES" });
  const toast = useToast();

  useEffect(() => setAddresses(initialValue), [initialValue]);

  const isValid = (addr) => addr.street?.trim() && addr.city?.trim() && addr.zip?.trim();

  const handleAdd = async () => {
    if (!isValid(newAddress)) {
      toast({ title: "Campos incompletos", status: "warning" });
      return;
    }

    try {
      const res = await editUserField("address", "add", newAddress);
      setAddresses(res.data.user.addresses);
      onChange?.(res.data.user.addresses);
      toast({ title: "Dirección agregada", status: "success" });
      setNewAddress({ street: "", city: "", zip: "", country: "ES" });
    } catch (err) {
      toast({ title: "Error al agregar dirección", description: err.message, status: "error" });
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await editUserField("address", "delete", {}, id);
      setAddresses(res.data.user.addresses);
      onChange?.(res.data.user.addresses);
      toast({ title: "Dirección eliminada", status: "info" });
    } catch (err) {
      toast({ title: "Error al eliminar", description: err.message, status: "error" });
    }
  };

  const handleUpdate = async (id, field, value) => {
    const updated = addresses.map((a) => (a._id === id ? { ...a, [field]: value } : a));
    setAddresses(updated);

    const addrToUpdate = updated.find((a) => a._id === id);
    try {
      const res = await editUserField("address", "update", addrToUpdate, id);
      setAddresses(res.data.user.addresses);
    } catch (err) {
      toast({ title: "Error al actualizar", description: err.message, status: "error" });
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      {addresses.map((addr) => (
        <Box key={addr._id || addr._tempId} p={3} borderWidth="1px" borderRadius="md">
          <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">Dirección</Text>
              <Button size="xs" colorScheme="red" onClick={() => handleRemove(addr._id)}>
                Eliminar
              </Button>
            </HStack>
            <Input size="sm" value={addr.street} onChange={(e) => handleUpdate(addr._id, "street", e.target.value)} placeholder="Calle" />
            <Input size="sm" value={addr.city} onChange={(e) => handleUpdate(addr._id, "city", e.target.value)} placeholder="Ciudad" />
            <Input size="sm" value={addr.zip} onChange={(e) => handleUpdate(addr._id, "zip", e.target.value)} placeholder="Código postal" />
            <Select size="sm" value={addr.country} onChange={(e) => handleUpdate(addr._id, "country", e.target.value)}>
              <option value="ES">España</option>
              <option value="AR">Argentina</option>
            </Select>
          </VStack>
        </Box>
      ))}

      <Divider />
      <Text fontWeight="bold">Agregar nueva dirección</Text>

      <FormControl>
        <FormLabel>Calle</FormLabel>
        <Input value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
      </FormControl>
      <FormControl>
        <FormLabel>Ciudad</FormLabel>
        <Input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
      </FormControl>
      <FormControl>
        <FormLabel>Código Postal</FormLabel>
        <Input value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} />
      </FormControl>
      <FormControl>
        <FormLabel>País</FormLabel>
        <Select value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}>
          <option value="ES">España</option>
          <option value="AR">Argentina</option>
        </Select>
      </FormControl>

      <Button onClick={handleAdd} colorScheme="blue">Agregar dirección</Button>
    </VStack>
  );
}
