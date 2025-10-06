import { useEffect, useState } from "react";
import {
  Box, VStack, Text, HStack, Button, Spinner, Badge, useDisclosure
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import ApiService from "../../../reducers/api/Api.jsx";

// Modales
import EditNameModal from "../../../components/Profile/EditNameModal.jsx";
import AddressModal from "../../../components/Profile/AdressesModal.jsx";
import PhoneModal from "../../../components/Profile/PhoneModal.jsx";

// Helpers
import { getDefaultAddress, getDefaultPhone, formatAddress, formatPhone } from "../../../components/Profile/UserUtils.jsx";

export default function ProfileDashboard() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const { isOpen: isNameOpen, onOpen: onOpenName, onClose: onCloseName } = useDisclosure();
  const { isOpen: isAddressesOpen, onOpen: onOpenAddresses, onClose: onCloseAddresses } = useDisclosure();
  const { isOpen: isPhonesOpen, onOpen: onOpenPhones, onClose: onClosePhones } = useDisclosure();

  // -------- Traer pedidos --------
  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await ApiService.get("/orders/my-orders");
        setOrders(res.orders || []);
      } catch {
        toast({ title: "Error al cargar pedidos", status: "error" });
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  // -------- Actualizar perfil --------
  const handleUpdateProfile = async (updatedFields) => {
    try {
      const res = await ApiService.patch("/users/update", updatedFields);
      setUser(prev => ({ ...prev, ...res.user }));
      toast({ title: "Datos actualizados", status: "success" });
    } catch {
      toast({ title: "Error al actualizar datos", status: "error" });
    }
  };

  const handleAddAddress = async (data) => {
    try {
      const res = await ApiService.post("/users/addresses", data);
      setUser(prev => ({ ...prev, addresses: res.addresses }));
      toast({ title: "Dirección añadida", status: "success" });
    } catch {
      toast({ title: "Error al añadir dirección", status: "error" });
    }
  };

  const handleUpdateAddress = async (id, data) => {
    try {
      const res = await ApiService.put(`/users/addresses/${id}`, data);
      setUser(prev => ({ ...prev, addresses: res.addresses }));
      toast({ title: "Dirección actualizada", status: "success" });
    } catch {
      toast({ title: "Error al actualizar dirección", status: "error" });
    }
  };

  const handleAddPhone = async (data) => {
    try {
      const res = await ApiService.post("/users/phones", data);
      setUser(prev => ({ ...prev, phones: res.phones }));
      toast({ title: "Teléfono añadido", status: "success" });
    } catch {
      toast({ title: "Error al añadir teléfono", status: "error" });
    }
  };

  const handleUpdatePhone = async (id, data) => {
    try {
      const res = await ApiService.put(`/users/phones/${id}`, data);
      setUser(prev => ({ ...prev, phones: res.phones }));
      toast({ title: "Teléfono actualizado", status: "success" });
    } catch {
      toast({ title: "Error al actualizar teléfono", status: "error" });
    }
  };

  const defaultAddress = getDefaultAddress(user);
  const defaultPhone = getDefaultPhone(user);

  const getStatusColor = (status) => ({
    pending: "yellow",
    completed: "green",
    cancelled: "red"
  }[status] || "gray");

  const formatPrice = (v) => (v / 100).toFixed(2);

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
          <Text>{formatAddress(defaultAddress) || "No disponible. Carga una nueva dirección"}</Text>
        </Box>
      </Box>

      {/* Teléfono */}
      <Box>
        <HStack justify="space-between" bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Teléfono</Text>
          <Button size="sm" colorScheme="blue" onClick={onOpenPhones}>Editar</Button>
        </HStack>
        <Box px={4} py={2}>
          <Text>{formatPhone(defaultPhone) || "No disponible. Carga un nuevo teléfono"}</Text>
        </Box>
      </Box>

      {/* Pedidos */}
      <Box>
        <Box bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Mis Pedidos</Text>
        </Box>
        <Box px={4} py={2}>
          {loadingOrders ? <Spinner /> : (
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

      {/* Modales */}
      <EditNameModal isOpen={isNameOpen} onClose={onCloseName} onSave={(newName) => handleUpdateProfile({ name: newName })} />
      <AddressModal isOpen={isAddressesOpen} onClose={onCloseAddresses} initialValue={user?.addresses || []} onSave={handleAddAddress} onUpdate={handleUpdateAddress} />
      <PhoneModal isOpen={isPhonesOpen} onClose={onClosePhones} initialValue={user?.phones || []} onSave={handleAddPhone} onUpdate={handleUpdatePhone} />
    </VStack>
  );
}
