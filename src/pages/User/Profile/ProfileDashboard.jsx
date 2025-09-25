import {
  Box,
  VStack,
  Text,
  HStack,
  Button,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";

// Modal de edición de nombre (si lo querés mantener)
import EditNameModal from "../../../components/Profile/EditNameModal.jsx";

export default function ProfileDashboard() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Control de modal de nombre
  const { isOpen: isNameOpen, onOpen: onOpenName, onClose: onCloseName } =
    useDisclosure();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data?.orders || [];
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

  return (
    <VStack align="stretch" spacing={6}>
      <Text fontSize="2xl" fontWeight="bold">
        Mi Perfil
      </Text>

      {/* Nombre */}
      <Box>
        <HStack
          justify="space-between"
          bg="gray.100"
          px={4}
          py={2}
          borderRadius="md"
        >
          <Text fontWeight="bold">Nombre</Text>
          <Button size="sm" colorScheme="blue" onClick={onOpenName}>
            Editar
          </Button>
        </HStack>
        <Box px={4} py={2}>
          <Text>{user?.name || "Sin nombre"}</Text>
        </Box>
      </Box>

      {/* Dirección */}
      <Box>
        <Box bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Dirección</Text>
        </Box>
        <Box px={4} py={2}>
          {user?.addresses?.length ? (
            <Text>
              {user.addresses[0].street}, {user.addresses[0].city} (
              {user.addresses[0].zip})
            </Text>
          ) : (
            <Text>No disponible. Carga una nueva dirección</Text>
          )}
        </Box>
      </Box>

      {/* Teléfono */}
      <Box>
        <Box bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Teléfono</Text>
        </Box>
        <Box px={4} py={2}>
          <Text>
            {user?.phones?.[0]?.number ||
              "No disponible. Carga un nuevo teléfono"}
          </Text>
        </Box>
      </Box>

      {/* Pedidos */}
      <Box>
        <Box bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Pedidos</Text>
        </Box>
        <Box px={4} py={2}>
          {loading ? (
            <Spinner />
          ) : orders.length > 0 ? (
            <>
              {orders.slice(0, 3).map((order) => (
                <Text key={order._id}>
                  Pedido #{order.code || order._id} –{" "}
                  {order.status || "En proceso"}
                </Text>
              ))}
              {orders.length > 3 && (
                <Button
                  mt={3}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => navigate("/profile/orders")}
                >
                  Ver todos los pedidos
                </Button>
              )}
            </>
          ) : (
            <Text>No hay historial de pedidos. ¡Haz un nuevo pedido!</Text>
          )}
        </Box>
      </Box>

      {/* Modal editar nombre */}
      <EditNameModal isOpen={isNameOpen} onClose={onCloseName} />
    </VStack>
  );
}
