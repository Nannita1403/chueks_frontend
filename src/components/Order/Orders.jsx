import { useState, useEffect } from "react";
import {
  Box, Button, Text, VStack, HStack, useDisclosure, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Divider, Badge
} from "@chakra-ui/react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Simulación fetch pedidos
  useEffect(() => {
    setOrders([
      {
        id: "ORD123",
        date: "2025-09-01",
        total: 120.5,
        status: "Entregado",
        items: [
          { name: "Zapatillas", price: 50, quantity: 1 },
          { name: "Remera", price: 20, quantity: 2 },
          { name: "Gorra", price: 30.5, quantity: 1 },
        ],
      },
      {
        id: "ORD124",
        date: "2025-09-02",
        total: 80,
        status: "Pendiente",
        items: [
          { name: "Buzo", price: 40, quantity: 2 },
        ],
      },
    ]);
  }, []);

  const openDetail = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Mis Pedidos</Text>

      <VStack spacing={4} align="stretch">
        {orders.map(order => (
          <Box key={order.id} p={4} bg="white" shadow="md" borderRadius="lg">
            <HStack justify="space-between">
              <Text fontWeight="bold">Pedido #{order.id}</Text>
              <Badge colorScheme={order.status === "Entregado" ? "green" : "yellow"}>
                {order.status}
              </Badge>
            </HStack>
            <Text fontSize="sm">Fecha: {order.date}</Text>
            <Text fontSize="sm">Total: ${order.total}</Text>
            <Button mt={2} size="sm" colorScheme="pink" onClick={() => openDetail(order)}>
              Ver detalle
            </Button>
          </Box>
        ))}
      </VStack>

      {/* Modal Detalle Pedido */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalle del pedido</ModalHeader>
          <ModalBody>
            {selectedOrder && (
              <Box>
                <Text><b>ID:</b> {selectedOrder.id}</Text>
                <Text><b>Fecha:</b> {selectedOrder.date}</Text>
                <Text><b>Estado:</b> {selectedOrder.status}</Text>
                <Divider my={3} />
                <Text fontWeight="bold">Productos:</Text>
                <VStack align="stretch" mt={2}>
                  {selectedOrder.items.map((item, i) => (
                    <HStack key={i} justify="space-between">
                      <Text>{item.name} x{item.quantity}</Text>
                      <Text>${item.price * item.quantity}</Text>
                    </HStack>
                  ))}
                </VStack>
                <Divider my={3} />
                <HStack justify="space-between">
                  <Text fontWeight="bold">Total:</Text>
                  <Text fontWeight="bold">${selectedOrder.total}</Text>
                </HStack>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Orders;
