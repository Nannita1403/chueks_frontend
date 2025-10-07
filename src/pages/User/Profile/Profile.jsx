import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "@chakra-ui/react";
import OrderModal from "../../../components/Order/OrderModal.jsx";
import UserLayout from "../UserLayout.jsx";
import { formatAddress, formatPhone, formatPrice, } from "../../../components/Profile/UserUtils.jsx";

export default function Profile() {
  const { user, token, logout } = useAuth(); 

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente": return "yellow";
      case "enviado": return "blue";
      case "entregado": return "green";
      case "cancelado": return "red";
      default: return "gray";
    }
  };

  const muted = useColorModeValue("gray.600", "gray.400");
  const toast = useToast();
  // 📌 Cargar órdenes
    useEffect(() => {
      if (token === undefined) return; // ⚠️ Espera a que el token esté definido (aunque sea null)
      if (!token) {
        logout();
        return;
      }

      const fetchOrders = async () => {
        try {
          const res = await axios.get("/api/orders/my-orders", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrders(res.data?.orders || []);
        } catch (err) {
          console.error("❌ Error cargando pedidos:", err);
          toast({ title: "Error al cargar pedidos", status: "error" });
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [token, toast, logout]);

  if (loading) {
    return (
      <Box maxW="container.xl" mx="auto" py={8} textAlign="center">
        <Spinner />
        <Text mt={2} color={muted}>
          Cargando perfil...
        </Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box maxW="container.xl" mx="auto" py={8} textAlign="center">
        <Text color={muted}>Usuario no autenticado</Text>
      </Box>
    );
  }

  return (
    <UserLayout>
      <Box maxW="container.xl" mx="auto" py={8}>
        <Heading mb={8}>Perfil de {user?.name || "Usuario"}</Heading>

        <VStack align="stretch" spacing={10}>

          {/* Pedidos */}
          <Box>
            <Box bg="gray.100" px={4} py={2} borderRadius="md">
              <Text fontWeight="bold">Mis Pedidos</Text>
            </Box>
            <Box px={4} py={2}>
                {loading ? <Spinner /> : (
                  orders.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {orders.map(order => (
                      <Box key={order._id} borderWidth="1px" borderRadius="md" p={4} shadow="sm">
                        <HStack justify="space-between" mb={2}>
                          <Text fontWeight="bold">Pedido #{order.code || order._id}</Text>
                          <Badge colorScheme={getStatusColor(order.status)}>{order.status}</Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.500" mb={2}>
                          Fecha: {new Date(order.createdAt).toLocaleDateString()}
                        </Text>
                        <Text fontWeight="medium" mb={2}>
                          Total: {formatPrice(order.total)} €
                        </Text>
                        <Box mb={2}>
                          <Text fontWeight="medium">Dirección:</Text>
                          <Text fontSize="sm">{formatAddress(order.address) || "No disponible"}</Text>
                        </Box>
                        <Box mb={2}>
                          <Text fontWeight="medium">Teléfono:</Text>
                          <Text fontSize="sm">{formatPhone(order.phone) || "No disponible"}</Text>
                        </Box>
                      </Box>
                    ))}
                  </VStack>
                ) : <Text>No tienes pedidos todavía.</Text>
              )}
            </Box>
          </Box>
        </VStack>

        {/* Modal detalle pedido */}
        <OrderModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
        />
      </Box>
    </UserLayout>
  );
}
