// src/components/Order/OrderCard.jsx
import { Box, Text, Stack, useColorModeValue } from "@chakra-ui/react";

export default function OrderCard({ order, onClick }) {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      bg={bg}
      p={4}
      cursor="pointer"
      shadow="sm"
      transition="all 0.2s"
      _hover={{ shadow: "md", transform: "translateY(-2px)" }}
      onClick={onClick}
    >
      <Stack spacing={2}>
        <Text fontWeight="bold">Pedido #{order._id}</Text>
        <Text fontSize="sm" color="gray.500">
          {new Date(order.createdAt).toLocaleDateString()}
        </Text>
        <Text fontSize="sm">Estado: {order.status || "Pendiente"}</Text>
        <Text fontWeight="semibold">Total: ${order.total || 0}</Text>
      </Stack>
    </Box>
  );
}
