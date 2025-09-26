import { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Text, FormControl, FormLabel, Select, HStack } from "@chakra-ui/react";

export default function AddressManager({ initialValue = [], onChange }) {
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

  const addAddress = () => {
    if (!newAddress.street.trim()) return;
    const updated = [...addresses, { ...newAddress, id: Date.now() }];
    setAddresses(updated);
    setNewAddress({ street: "", city: "", zip: "", country: "ES" });
    onChange?.(updated);
  };

  const removeAddress = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    onChange?.(updated);
  };

  return (
    <VStack align="stretch" spacing={3}>
      {addresses.map((addr) => (
        <Box key={addr.id} p={3} borderWidth="1px" borderRadius="md">
          <Text>
            {addr.street}, {addr.city} ({addr.zip}) [{addr.country}]
          </Text>
          <Button mt={2} size="xs" colorScheme="red" onClick={() => removeAddress(addr.id)}>
            Eliminar
          </Button>
        </Box>
      ))}

      {/* Inputs */}
      <FormControl>
        <FormLabel>Calle</FormLabel>
        <Input
          value={newAddress.street}
          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Ciudad</FormLabel>
        <Input
          value={newAddress.city}
          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Código Postal</FormLabel>
        <Input
          value={newAddress.zip}
          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>País</FormLabel>
        <Select
          value={newAddress.country}
          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
        >
          <option value="ES">España</option>
          <option value="AR">Argentina</option>
        </Select>
      </FormControl>

      <Button onClick={addAddress} colorScheme="blue">Agregar domicilio</Button>
    </VStack>
  );
}
