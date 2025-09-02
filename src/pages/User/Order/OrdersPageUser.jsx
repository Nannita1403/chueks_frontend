import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
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

        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.orders || [];

        setOrders(list);
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

  if (loading) {
    return (
      <Box maxW="container.xl" mx="auto" py={8} textAlign="center">
        <Spinner />
        <Text mt={2} color={muted}>
          Cargando pedidos...
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <Heading size="lg" mb={6}>
        Mis pedidos
      </Heading>
      <Divider mb={6} />

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

      {/* Modal detalle pedido */}
      <OrderModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </Box>
  );
}