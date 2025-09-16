import { useEffect, useState } from "react";
import {
  Box, Heading, Text, Divider, Spinner, VStack, HStack, Image, SimpleGrid,
  useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, ModalFooter, Button
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";

export default function OrdersPageUser() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const muted = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders ?? []);
      } catch (err) {
        console.error("❌ Error cargando pedidos:", err);
        toast({ title: "Error al cargar pedidos", status: "error" });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token, toast]);

  const formatNumber = (num) => (num ?? 0).toLocaleString("es-AR");

  if (loading) return (
    <Box maxW="container.xl" mx="auto" py={8} textAlign="center">
      <Spinner />
      <Text mt={2} color={muted}>Cargando pedidos...</Text>
    </Box>
  );

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <Heading size="lg" mb={6}>Mis pedidos</Heading>
      <Divider mb={6} />

      {orders.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
          {orders.map((order) => (
            <Box
              key={order._id}
              border="1px solid #eee"
              borderRadius="md"
              p={4}
              cursor="pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <Text fontWeight="bold">Pedido: {order.code}</Text>
              <Text>Estado: {order.status}</Text>
              <Text>Fecha: {new Date(order.createdAt).toLocaleString("es-AR")}</Text>
              <Text>Total: ${formatNumber(order.total)}</Text>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text color={muted}>No tienes pedidos todavía.</Text>
      )}

      {/* Modal detalle pedido */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pedido: {selectedOrder?.code}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder?.items?.map((item, idx) => (
              <VStack key={idx} align="stretch" p={3} border="1px solid #eee" borderRadius="md" spacing={2}>
                <HStack spacing={3}>
                  {item.image && <Image src={item.image} boxSize="60px" objectFit="cover" />}
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text fontSize="sm" color="gray.500">ID: {item.productId}</Text>
                  </VStack>
                </HStack>
                {item.description && <Text fontSize="sm">{item.description}</Text>}
                <Text>Color: {item.color ?? "—"}</Text>
                <Text>Unitario: ${formatNumber(item.unitPrice)}</Text>
                {item.priceMay && <Text>Precio Mayorista: ${formatNumber(item.priceMay)}</Text>}
                <Text>Cantidad: {item.quantity}</Text>
                <Text fontWeight="bold">Total: ${formatNumber(item.totalPrice)}</Text>
                <Text>Stock color: {item.stock}</Text>
              </VStack>
            ))}
            <Divider my={3} />
            <Text fontWeight="bold">Subtotal: ${formatNumber(selectedOrder?.subtotal)}</Text>
            <Text>Envío: ${formatNumber(selectedOrder?.shipping)}</Text>
            <Text fontWeight="bold">Total: ${formatNumber(selectedOrder?.total)}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setSelectedOrder(null)}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
