// src/components/Profile/AddressManager.jsx
import { useState } from "react";
import { Box, Button, Input, VStack, Text } from "@chakra-ui/react";

export default function PhoneManager() {
  const [phones, setPhones] = useState([]);
  const [newPhone, setNewPhone] = useState("");

  const addPhone = () => {
    if (!newPhone.trim()) return;
    setPhones([...phones, newPhone]);
    setNewPhone("");
  };

  return (
    <VStack align="stretch" spacing={3}>
      {phones.map((phone, i) => (
        <Box key={i} p={3} borderWidth="1px" borderRadius="md">
          <Text>{phone}</Text>
        </Box>
      ))}
      <Input
        placeholder="Nuevo Telefono"
        value={newPhone}
        onChange={(e) => setNewPhone(e.target.value)}
      />
      <Button onClick={addPhone}>Agregar Telefono</Button>
    </VStack>
  );
}
