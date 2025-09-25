import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Text,
  HStack,
  Button,
  Spinner,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";

// Modales
import EditNameModal from "../../../components/Profile/EditNameModal.jsx";
import EditLastNameModal from "../../../components/Profile/EditLastNameModal.jsx";
import AddressModal from "../../../components/Profile/AdressesModal.jsx";
import PhoneModal from "../../../components/Profile/PhoneModal.jsx";

export default function ProfileDashboard() {
  const { user, token, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Control de modales
  const { isOpen: isNameOpen, onOpen: onOpenName, onClose: onCloseName } = useDisclosure();
  const { isOpen: isLastNameOpen, onOpen: onOpenLastName, onClose: onCloseLastName } = useDisclosure();
  const { isOpen: isAddressesOpen, onOpen: onOpenAddresses, onClose: onCloseAddresses } = useDisclosure();
  const { isOpen: isPhonesOpen, onOpen: onOpenPhones, onClose: onClosePhones } = useDisclosure();

  // Dirección y teléfono por defecto
  const defaultAddress = user?.addresses?.find(a => a.default) || user?.addresses?.[0];
  const defaultPhone = user?.phones?.find(p => p.default) || user?.phones?.[0];

  // Traer pedidos del usuario
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
        setLoadingOrders(false);
      }
    };
    if (token) fetchOrders();
  }, [token, toast]);

  // Actualizar user local y backend
  const handleUpdateUser = async (updatedFields) => {
    try {
      const res = await axios.patch("/api/users/me", updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      toast({ title: "Datos actualizados", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error al actualizar datos", status: "error" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "yellow";
      case "completed": return "green";
      case "cancelled": return "red";
      default: return "gray";
    }
  };

  return (
    <VStack align="stretch" spacing={6}>
      <Text fontSize="2xl" fontWeight="bold">Mi Perfil</Text>

      {/* Nombre */}
      <Box>
        <HStack justify="space-between" bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Nombre</Text>
          <Button size="sm" colorScheme="blue" onClick={onOpenName}>Editar</Button>
        </HStack>
        <Box px={4} py={2}>
          <Text>{user?.firstName || "Sin nombre"}</Text>
        </Box>
      </Box>

      {/* Apellido */}
      <Box>
        <HStack justify="space-between" bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Apellido</Text>
          <Button size="sm" colorScheme="blue" onClick={onOpenLastName}>Editar</Button>
        </HStack>
        <Box px={4} py={2}>
          <Text>{user?.lastName || "Sin apellido"}</Text>
        </Box>
      </Box>

      {/* Dirección */}
      <Box>
        <HStack justify="space-between" bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Dirección</Text>
          <Button size="sm" colorScheme="blue" onClick={onOpenAddresses}>Editar</Button>
        </HStack>
        <Box px={4} py={2}>
          {defaultAddress ? (
            <Text>{defaultAddress.street}, {defaultAddress.city} ({defaultAddress.zip}) [{defaultAddress.country}]</Text>
          ) : (
            <Text>No disponible. Carga una nueva dirección</Text>
          )}
        </Box>
      </Box>

      {/* Teléfono */}
      <Box>
        <HStack justify="space-between" bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Teléfono</Text>
          <Button size="sm" colorScheme="blue" onClick={onOpenPhones}>Editar</Button>
        </HStack>
        <Box px={4} py={2}>
          {defaultPhone ? (
            <Text>{defaultPhone.number} ({defaultPhone.country})</Text>
          ) : (
            <Text>No disponible. Carga un nuevo teléfono</Text>
          )}
        </Box>
      </Box>

      {/* Pedidos */}
      <Box>
        <Box bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Mis Pedidos</Text>
        </Box>
        <Box px={4} py={2}>
          {loadingOrders ? (
            <Spinner />
          ) : orders.length > 0 ? (
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
                    Total: {(order.total / 100)?.toFixed(2) || "-"} €
                  </Text>

                  {/* Dirección y teléfono del pedido */}
                  <Box mb={2}>
                    <Text fontWeight="medium">Dirección:</Text>
                    <Text fontSize="sm">
                      {order.address ? `${order.address.street}, ${order.address.city} (${order.address.zip}) [${order.address.country}]` : "No disponible"}
                    </Text>
                  </Box>
                  <Box mb={2}>
                    <Text fontWeight="medium">Teléfono:</Text>
                    <Text fontSize="sm">
                      {order.phone ? `${order.phone.number} (${order.phone.country})` : "No disponible"}
                    </Text>
                  </Box>

                  {/* Items del pedido */}
                  <Box>
                    <Text fontWeight="medium">Productos:</Text>
                    <VStack align="start" spacing={1}>
                      {order.items?.map((item, idx) => (
                        <Text key={idx} fontSize="sm">
                          {item.name} x {item.quantity} - {(item.price / 100).toFixed(2)} €
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              ))}
              {orders.length > 3 && (
                <Button size="sm" colorScheme="blue" onClick={() => navigate("/profile/orders")}>
                  Ver todos los pedidos
                </Button>
              )}
            </VStack>
          ) : (
            <Text>No tienes pedidos todavía.</Text>
          )}
        </Box>
      </Box>

      {/* Modales */}
      <EditNameModal
        isOpen={isNameOpen}
        onClose={onCloseName}
        onSave={(newName) => handleUpdateUser({ firstName: newName })}
      />
      <EditLastNameModal
        isOpen={isLastNameOpen}
        onClose={onCloseLastName}
        onSave={(newLastName) => handleUpdateUser({ lastName: newLastName })}
      />
      <AddressModal
        isOpen={isAddressesOpen}
        onClose={onCloseAddresses}
        onSave={(newAddresses) => handleUpdateUser({ addresses: newAddresses })}
      />
      <PhoneModal
        isOpen={isPhonesOpen}
        onClose={onClosePhones}
        onSave={(newPhones) => handleUpdateUser({ phones: newPhones })}
      />
    </VStack>
  );
}
