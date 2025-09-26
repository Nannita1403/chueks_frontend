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
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import ApiService from "../../../reducers/api/Api.jsx";

// Modales
import EditNameModal from "../../../components/Profile/EditNameModal.jsx";
import EditLastNameModal from "../../../components/Profile/EditLastNameModal.jsx";
import AddressModal from "../../../components/Profile/AdressesModal.jsx";
import PhoneModal from "../../../components/Profile/PhoneModal.jsx";

export default function ProfileDashboard() {
  const { user, setUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Modales
  const { isOpen: isNameOpen, onOpen: onOpenName, onClose: onCloseName } = useDisclosure();
  const { isOpen: isLastNameOpen, onOpen: onOpenLastName, onClose: onCloseLastName } = useDisclosure();
  const { isOpen: isAddressesOpen, onOpen: onOpenAddresses, onClose: onCloseAddresses } = useDisclosure();
  const { isOpen: isPhonesOpen, onOpen: onOpenPhones, onClose: onClosePhones } = useDisclosure();

  // -------- Traer pedidos del usuario --------
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await ApiService.get("/orders/my-orders");
        setOrders(res.orders || []);
      } catch (err) {
        console.error("Error cargando pedidos:", err);
        toast({ title: "Error al cargar pedidos", status: "error" });
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  // -------- Actualizar nombre / teléfono --------
  const handleUpdateProfile = async (updatedFields) => {
    try {
      const res = await ApiService.patch("/users/update", updatedFields);
       setUser(prev => ({ ...prev, ...res.user }));
        toast({ title: "Datos actualizados", status: "success" });
      } catch (err) {
        console.error(err);
        toast({ title: "Error al actualizar datos", status: "error" });
      }
    };

  // -------- Direcciones --------
  const handleAddAddress = async (addressData) => {
    try {
      const res = await ApiService.post("/users/addresses", addressData);
      setUser(prev => ({ ...prev, addresses: res.addresses }));
      toast({ title: "Dirección añadida", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error al añadir dirección", status: "error" });
    }
  };

  const handleUpdateAddress = async (id, updatedAddress) => {
    try {
      const res = await ApiService.put(`/users/addresses/${id}`, updatedAddress);
      setUser(prev => ({ ...prev, addresses: res.addresses }));
      toast({ title: "Dirección actualizada", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error al actualizar dirección", status: "error" });
    }
  };

  // -------- Teléfonos --------
  const handleAddPhone = async (phoneData) => {
    try {
      const res = await ApiService.post("/users/phones", phoneData);
      setUser(prev => ({ ...prev, phones: res.phones }));
      toast({ title: "Teléfono añadido", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error al añadir teléfono", status: "error" });
    }
  };

  const handleUpdatePhone = async (id, updatedPhone) => {
    try {
      const res = await ApiService.put(`/users/phones/${id}`, updatedPhone);
      setUser(prev => ({ ...prev, phones: res.phones }));
      toast({ title: "Teléfono actualizado", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error al actualizar teléfono", status: "error" });
    }
  };

  // -------- Datos por defecto --------
  const defaultAddress = user?.addresses?.find(a => a.default) || user?.addresses?.[0];
  const defaultPhone = user?.phones?.find(p => p.default) || user?.phones?.[0];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "yellow";
      case "completed": return "green";
      case "cancelled": return "red";
      default: return "gray";
    }
  };

  const formatPrice = (value) => (value / 100).toFixed(2);

  if (!user) return <Spinner />;

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
          <Text>{user?.name || "Sin nombre"}</Text>
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
            <Text>{defaultPhone.number} ({defaultPhone.label || "personal"})</Text>
          ) : (
            <Text>No disponible. Carga un nuevo teléfono</Text>
          )}
        </Box>
      </Box>

      {/* Pedidos */}
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
                    Total: {formatPrice(order.total)} €
                  </Text>

                  {/* Dirección y teléfono */}
                  <Box mb={2}>
                    <Text fontWeight="medium">Dirección:</Text>
                    <Text fontSize="sm">
                      {order.address
                        ? `${order.address.street}, ${order.address.city} (${order.address.zip}) [${order.address.country}]`
                        : "No disponible"}
                    </Text>
                  </Box>
                  <Box mb={2}>
                    <Text fontWeight="medium">Teléfono:</Text>
                    <Text fontSize="sm">
                      {order.phone
                        ? `${order.phone.number} (${order.phone.country})`
                        : "No disponible"}
                    </Text>
                  </Box>

                  {/* Productos */}
                  <Box>
                    <Text fontWeight="medium">Productos:</Text>
                    <VStack align="start" spacing={1}>
                      {order.items?.map((item, idx) => (
                        <Text key={idx} fontSize="sm">
                          {item.name} x {item.quantity} - {item.color.name} 
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
      <EditNameModal isOpen={isNameOpen} onClose={onCloseName} onSave={(newName) => handleUpdateProfile({ name: newName })} />
      <AddressModal isOpen={isAddressesOpen} onClose={onCloseAddresses} initialValue={user?.addresses || []} onSave={handleAddAddress} onUpdate={handleUpdateAddress} />
      <PhoneModal isOpen={isPhonesOpen} onClose={onClosePhones} initialValue={user?.phones || []} onSave={handleAddPhone} onUpdate={handleUpdatePhone} />
    </VStack>
  );
}
