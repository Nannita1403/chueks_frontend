import { useState, useEffect } from "react";
import {
  Box, Button, Input, VStack, Text, FormControl,
  FormLabel, Select, HStack, Divider
} from "@chakra-ui/react";

export default function AddressManager({
  initialValue = [],
  onChange,
  onUpdate,
  onDelete,
}) {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    zip: "",
    country: "ES",
  });

  useEffect(() => {
    setAddresses(initialValue);
  }, [initialValue]);

  const isValid = (addr) =>
    addr.street?.trim() && addr.city?.trim() && addr.zip?.trim();

  const handleAdd = () => {
    if (!isValid(newAddress)) return;

    const alreadyExists = addresses.some(
      (a) =>
        a.street === newAddress.street &&
        a.city === newAddress.city &&
        a.zip === newAddress.zip
    );

    if (alreadyExists) return;

    const newEntry = { ...newAddress, _tempId: Date.now() };
    const updated = [...addresses, newEntry];
    setAddresses(updated);
    onChange?.(updated);
    setNewAddress({ street: "", city: "", zip: "", country: "ES" });
  };

  const handleRemove = async (id) => {
    const isServerId = typeof id === "string";
    if (isServerId && onDelete) await onDelete(id);

    const updated = addresses.filter((a) => a._id !== id && a._tempId !== id);
    setAddresses(updated);
    onChange?.(updated);
  };

  const handleUpdate = async (id, field, value) => {
    const updated = addresses.map((a) =>
      a._id === id || a._tempId === id ? { ...a, [field]: value } : a
    );
    setAddresses(updated);
    onChange?.(updated);

    const updatedAddr = updated.find(
      (a) => a._id === id || a._tempId === id
    );

    if (updatedAddr._id && onUpdate) {
      const { _id, ...rest } = updatedAddr;
      await onUpdate(_id, rest);
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      {addresses.map((addr) => {
        const id = addr._id || addr._tempId;
        return (
          <Box key={id} p={3} borderWidth="1px" borderRadius="md">
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold">Dirección</Text>
                <Button
                  size="xs"
                  colorScheme="red"
                  onClick={() => handleRemove(addr._id || addr._tempId)}
                >
                  Eliminar
                </Button>
              </HStack>
              <Input
                size="sm"
                value={addr.street}
                onChange={(e) => handleUpdate(id, "street", e.target.value)}
                placeholder="Calle"
              />
              <Input
                size="sm"
                value={addr.city}
                onChange={(e) => handleUpdate(id, "city", e.target.value)}
                placeholder="Ciudad"
              />
              <Input
                size="sm"
                value={addr.zip}
                onChange={(e) => handleUpdate(id, "zip", e.target.value)}
                placeholder="Código postal"
              />
              <Select
                size="sm"
                value={addr.country}
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
      <Text fontWeight="bold">Agregar nueva dirección</Text>

      <FormControl>
        <FormLabel>Calle</FormLabel>
        <Input
          value={newAddress.street}
          onChange={(e) =>
            setNewAddress({ ...newAddress, street: e.target.value })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Ciudad</FormLabel>
        <Input
          value={newAddress.city}
          onChange={(e) =>
            setNewAddress({ ...newAddress, city: e.target.value })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Código Postal</FormLabel>
        <Input
          value={newAddress.zip}
          onChange={(e) =>
            setNewAddress({ ...newAddress, zip: e.target.value })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>País</FormLabel>
        <Select
          value={newAddress.country}
          onChange={(e) =>
            setNewAddress({ ...newAddress, country: e.target.value })
          }
        >
          <option value="ES">España</option>
          <option value="AR">Argentina</option>
        </Select>
      </FormControl>

      <Button onClick={handleAdd} colorScheme="blue">
        Agregar dirección
      </Button>
    </VStack>
  );
}
