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
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import OrderCard from "../../../components/Order/OrderCard.jsx";
import OrderModal from "../../../components/Order/OrderModal.jsx";
import UserLayout from "../UserLayout.jsx";
import AddressModal from "../../../components/Profile/AdressesModal.jsx";
import PhoneModal from "../../../components/Profile/PhoneModal.jsx";

export default function Profile() {
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { isOpen: isAddressesOpen, onOpen: onOpenAddresses, onClose: onCloseAddresses } = useDisclosure();
  const { isOpen: isPhonesOpen, onOpen: onOpenPhones, onClose: onClosePhones } = useDisclosure();

  const muted = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
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

    if (token) fetchOrders();
  }, [token, toast]);

  if (loading) {
    return (
      <Box maxW="container.xl" mx="auto" py={8} textAlign="center">
        <Spinner />
        <Text mt={2} color={muted}>Cargando perfil...</Text>
      </Box>
    );
  }

  return (
    <UserLayout onOpenAddresses={onOpenAddresses} onOpenPhones={onOpenPhones}>
      <Box maxW="container.xl" mx="auto" py={8}>
        <Heading mb={8}>Perfil de {user?.firstName || "Usuario"}</Heading>

        <VStack align="stretch" spacing={10}>
          {/* Pedidos */}
          <Box>
            <Heading size="md" mb={3}>Mis pedidos</Heading>
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

        {/* Modals de dirección y teléfono */}
        <AddressModal isOpen={isAddressesOpen} onClose={onCloseAddresses} />
        <PhoneModal isOpen={isPhonesOpen} onClose={onClosePhones} />
      </Box>
    </UserLayout>
  );
}
