// src/components/Profile/AddressManager.jsx
import { useState } from "react";
import { Box, Button, Input, VStack, Text } from "@chakra-ui/react";

export default function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");

  const addAddress = () => {
    if (!newAddress.trim()) return;
    setAddresses([...addresses, newAddress]);
    setNewAddress("");
  };

  return (
    <VStack align="stretch" spacing={3}>
      {addresses.map((addr, i) => (
        <Box key={i} p={3} borderWidth="1px" borderRadius="md">
          <Text>{addr}</Text>
        </Box>
      ))}
      <Input
        placeholder="Nuevo domicilio"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
      />
      <Button onClick={addAddress}>Agregar domicilio</Button>
    </VStack>
  );
}
