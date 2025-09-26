import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  Spinner,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import OrderCard from "../../../components/Order/OrderCard.jsx";
import OrderModal from "../../../components/Order/OrderModal.jsx";
import UserLayout from "../UserLayout.jsx";

export default function Profile() {
  const { user, token, logout } = useAuth(); 

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const muted = useColorModeValue("gray.600", "gray.400");

  // 📌 Cargar órdenes
  useEffect(() => {
    if (!token) return logout(); 

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
            <Heading size="md" mb={3}>
              Mis pedidos
            </Heading>
            <Divider mb={4} />

            {orders.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Text color={muted}>No tienes pedidos todavía.</Text>
            )}
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
