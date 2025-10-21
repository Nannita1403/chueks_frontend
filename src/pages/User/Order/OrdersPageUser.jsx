import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Divider,
  Spinner,
  VStack,
  HStack,
  Image,
  SimpleGrid,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Badge,
  Checkbox,
} from "@chakra-ui/react";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import ApiService from "../../../reducers/api/Api.jsx";

export default function OrdersPageUser() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const muted = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("gray.50", "gray.700");

  const fetchOrders = async () => {
    try {
      const res = await ApiService.get("/orders/my-orders");
      setOrders(res.orders || res.data || res || []);
      console.log("Pedidos:", res);
    } catch (err) {
      console.error(err);
      toast({ title: "Error al cargar pedidos", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const formatNumber = (num) => (num ?? 0).toLocaleString("es-AR");

  if (loading)
    return (
      <Box maxW="container.xl" mx="auto" py={8} textAlign="center">
        <Spinner />
        <Text mt={2} color={muted}>
          Cargando pedidos...
        </Text>
      </Box>
    );

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <Heading size="lg" mb={6}>
        Historial de Pedidos
      </Heading>
      <Divider mb={6} />

      {orders.length === 0 ? (
        <Text color={muted}>No tienes pedidos todavía.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {orders.map((order) => (
            
            <Box
              key={order._id}
              borderRadius="md"
              border="1px solid #eee"
              p={4}
              bg={cardBg}
              cursor="pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <HStack justify="space-between">
                
                <Text fontWeight="bold">Pedido: {order.code}</Text>
                <Badge
                  colorScheme={
                    order.status === "pending"
                      ? "yellow"
                      : order.status === "processing"
                      ? "blue"
                      : order.status === "completed"
                      ? "green"
                      : "red"
                  }
                >
                  {order.status.toUpperCase()}
                </Badge>
              </HStack>
              <Text color={muted} fontSize="sm">
                Fecha: {new Date(order.createdAt).toLocaleString("es-AR")}
              </Text>
              <Text fontWeight="bold" mt={2}>
                Total: ${formatNumber(order.total)}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Modal detalle de pedido */}
      {selectedOrder && (
        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} size="4xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Pedido: {selectedOrder.code}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                {selectedOrder.items?.map((item, idx) => (
                  <Box key={idx} border="1px solid #eee" borderRadius="md" p={4}>
                  <HStack spacing={4} align="start">
                    <Image
                      src={
                        item?.imgPrimary ||
                        item?.imageUrl ||
                        item?.image ||
                        item?.product?.imgPrimary ||
                        "/placeholder.svg"
                      }
                      alt={item?.name || "Producto"}
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                      fallbackSrc="/placeholder.svg"
                    />

                    <VStack align="start" spacing={1} flex="1">
                      <Text fontWeight="bold" fontSize="lg">
                        {item.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Código: {item.code}
                      </Text>
                      {item.description && (
                        <Text fontSize="sm" color={muted} noOfLines={3}>
                          {item.description}
                        </Text>
                      )}
                      <HStack spacing={4} mt={1}>
                        <Text>Color: {item.color ?? "—"}</Text>
                        <Text>Cantidad: {item.quantity}</Text>
                        <Text>Unitario: ${formatNumber(item.unitPrice)}</Text>
                        {item.priceMay && <Text>Mayorista: ${formatNumber(item.priceMay)}</Text>}
                        <Text fontWeight="bold">Total: ${formatNumber(item.totalPrice)}</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Stock: {item.stock}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                ))}
              </VStack>

              <Divider my={4} />

              <VStack spacing={1} align="flex-end">
                <Text>Subtotal: ${formatNumber(selectedOrder.subtotal)}</Text>
                <Text>Envío: ${formatNumber(selectedOrder.shipping)}</Text>
                <Text fontWeight="bold">Total: ${formatNumber(selectedOrder.total)}</Text>

                <HStack mt={2} spacing={2} align="center">
                  <Text>Estado:</Text>
                  <Badge
                    colorScheme={
                      selectedOrder.status === "pending"
                        ? "yellow"
                        : selectedOrder.status === "processing"
                        ? "blue"
                        : selectedOrder.status === "completed"
                        ? "green"
                        : "red"
                    }
                  >
                    {selectedOrder.status.toUpperCase()}
                  </Badge>
                </HStack>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setSelectedOrder(null)}>Cerrar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
