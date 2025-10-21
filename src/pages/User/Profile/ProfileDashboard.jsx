import { useEffect, useState } from "react";
import {  Box, VStack, Text, HStack, Button, Spinner, useDisclosure, Badge
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import ApiService from "../../../reducers/api/Api.jsx";
import EditNameModal from "../../../components/Profile/EditNameModal.jsx";
import AddressModal from "../../../components/Profile/AdressesModal.jsx";
import PhoneModal from "../../../components/Profile/PhoneModal.jsx";
import CompleteProfileModal from "../../../components/Profile/CompleteProfileModal.jsx";

import { getDefaultAddress, getDefaultPhone,  formatAddress, formatPhone, formatPrice } from "../../../components/Profile/UserUtils.jsx";

export default function ProfileDashboard() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const {
    isOpen: isNameOpen,
    onOpen: onOpenName,
    onClose: onCloseName
  } = useDisclosure();

  const {
    isOpen: isAddressesOpen,
    onOpen: onOpenAddresses,
    onClose: onCloseAddresses
  } = useDisclosure();

  const {
    isOpen: isPhonesOpen,
    onOpen: onOpenPhones,
    onClose: onClosePhones
  } = useDisclosure();

  const { 
    isOpen: isCompleteOpen, 
    onOpen: onOpenComplete, 
    onClose: onCloseComplete 
  } = useDisclosure();

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente": return "orange";
      case "pagado": return "green";
      case "enviado": return "blue";
      case "cancelado": return "red";
      default: return "gray";
    }
  };

    useEffect(() => {
      if (user) {
        const needsName = !user.name?.trim();
        const needsPhone = !user.telephones || user.telephones.length === 0;
        const needsAddress = !user.addresses || user.addresses.length === 0;

        if (needsName || needsPhone || needsAddress) {
          setShowCompleteModal(true);
          onOpenComplete();
        }
      }
    }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await ApiService.get("/orders/my-orders");
        setOrders(res.orders || res.data || res || []);
      } catch {
        toast({ title: "Error al cargar pedidos", status: "error" });
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  const updateUser = (updatedFields, message = "Datos actualizados") => {
    setUser({ ...user, ...updatedFields });
    toast({ title: message, status: "success" });
  };

  const handleUpdateProfile = async (fields) => {
    try {
      const res = await ApiService.patch("/users/update", fields);
      updateUser(res.user);
    } catch (error) {
      toast({
        title: error?.response?.data?.message || "Error al actualizar datos",
        status: "error"
      });
    }
  };

const handleCompleteProfile = async (data) => {
  if (data.name?.trim()) {
    await handleUpdateProfile({ name: data.name });
  }
  if (data.telephone?.trim()) {
    await handleAddPhone({ number: data.telephone, label: "personal" });
  }
  if (isValidAddress(data)) {
    await handleAddAddress({
      street: data.street,
      city: data.city,
      zip: data.zip
    });
  }

  setShowCompleteModal(false);
};
  const isValidAddress = ({ street, city, zip }) => street?.trim() && city?.trim() && zip?.trim();
  const isValidPhone = ({ number }) => number?.trim();

  const handleAddAddress = async (address) => {
    if (!isValidAddress(address)) {
      return toast({ title: "Completa todos los campos", status: "warning" });
    }

    const exists = user.addresses?.some(a =>
      a.street === address.street && a.city === address.city && a.zip === address.zip
    );
    if (exists) {
      return toast({ title: "Esta dirección ya existe", status: "warning" });
    }
    try {
      const res = await ApiService.post("/users/addresses", address);
      updateUser({ addresses: res.user?.addresses || res.addresses });
    } catch (error) {
      toast({ title: "Error al añadir dirección", status: "error" });
    }
  };

  const handleUpdateAddress = async (id, address) => {
    if (!isValidAddress(address)) {
      return toast({ title: "Completa todos los campos", status: "warning" });
    }
    try {
      const res = await ApiService.put(`/users/addresses/${id}`, address);
      updateUser({ addresses: res.user?.addresses || res.addresses });
    } catch (error) {
      toast({ title: "Error al actualizar dirección", status: "error" });
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await ApiService.delete(`/users/addresses/${id}`);
      updateUser({ addresses: res.user?.addresses || user.addresses.filter(a => a._id !== id) }, "Dirección eliminada");
    } catch (error) {
      toast({ title: "Error al eliminar dirección", status: "error" });
    }
  };

  const handleAddPhone = async (telephone) => {
  if (!telephone.number?.trim()) return toast({ title: "Ingresa un número válido", status: "warning" });
  if (user.telephones?.some(p => p.number === telephone.number)) {
    return toast({ title: "Este número ya existe", status: "warning" });
  }

  try {
    const res = await ApiService.post("/users/telephones", telephone);
    updateUser({ telephones: res.user?.telephones || res.telephones });
  } catch (error) {
    toast({ title: "Error al añadir teléfono", status: "error" });
  }
};

  const handleUpdatePhone = async (id, telephone) => {
    if (!isValidPhone(telephone)) {
      return toast({ title: "Ingresa un número válido", status: "warning" });
    }
    try {
      const res = await ApiService.put(`/users/telephones/${id}`, telephone);
      updateUser({ telephones: res.user?.telephones || res.telephones });
    } catch (error) {
      toast({ title: "Error al actualizar teléfono", status: "error" });
    }
  };

  const handleDeletePhone = async (id) => {
    try {
      const res = await ApiService.delete(`/users/telephones/${id}`);
      updateUser({ telephones: res.user?.telephones || user.telephones.filter(p => p._id !== id) }, "Teléfono eliminado");
    } catch (error) {
      toast({ title: "Error al eliminar teléfono", status: "error" });
    }
  };

  const defaultAddress = getDefaultAddress(user);
  const defaultPhone = getDefaultPhone(user);

  if (!user) return <Spinner />;

  return (
    <VStack align="stretch" spacing={6}>
      <Text fontSize="2xl" fontWeight="bold">Mi Perfil</Text>
      <Section label="Nombre" onEdit={onOpenName}>
        <Text>{user.name || "Sin nombre"}</Text>
      </Section>

      <Section label="Dirección" onEdit={onOpenAddresses}>
        <Text>{formatAddress(defaultAddress) || "No disponible. Carga una nueva dirección"}</Text>
      </Section>

      <Section label="Teléfono" onEdit={onOpenPhones}>
        <Text>{formatPhone(defaultPhone) || "No disponible. Carga un nuevo teléfono"}</Text>
      </Section>

      <Box>
        <Box bg="gray.100" px={4} py={2} borderRadius="md">
          <Text fontWeight="bold">Mis Pedidos</Text>
        </Box>
        <Box px={4} py={2}>
          {loadingOrders ? (
              <Spinner />
            ) : orders.length > 0 ? (
              <>
                <VStack spacing={4} align="stretch">
                  {orders
                    .slice() 
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
                    .slice(0, 3)
                    .map(order => (
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
                          <Text fontSize="sm">{formatPhone(order.telephone) || "No disponible"}</Text>
                        </Box>
                      </Box>
                  ))}
                </VStack>
                <Button
                  mt={4}
                  colorScheme="blue"
                  onClick={() => navigate("/profile/orders")}
                  alignSelf="center"
                >
                  Ver todos los pedidos
                </Button>
              </>
            ) : (
              <Text>No tienes pedidos todavía.</Text>
            )}
        </Box>
      </Box>

      <EditNameModal
        isOpen={isNameOpen}
        onClose={onCloseName}
        onSave={(newName) => handleUpdateProfile({ name: newName })}
      />
      <AddressModal
        isOpen={isAddressesOpen}
        onClose={onCloseAddresses}
        initialValue={user?.addresses || []}
        onSave={handleAddAddress}
        onUpdate={handleUpdateAddress}
        deleteAddress={handleDeleteAddress}
      />
      <PhoneModal
        isOpen={isPhonesOpen}
        onClose={onClosePhones}
        initialValue={user?.telephones || []}
        onSave={handleAddPhone}
        onUpdate={handleUpdatePhone}
        deletePhone={handleDeletePhone}
      />
      <CompleteProfileModal
        isOpen={isCompleteOpen}
        onClose={onCloseComplete}
        onSave={handleCompleteProfile}
      />
    </VStack>
  );
}

function Section({ label, onEdit, children }) {
  return (
    <Box>
      <HStack justify="space-between" bg="gray.100" px={4} py={2} borderRadius="md">
        <Text fontWeight="bold">{label}</Text>
        <Button size="sm" colorScheme="blue" onClick={onEdit}>Editar</Button>
      </HStack>
      <Box px={4} py={2}>{children}</Box>
    </Box>
  );
}
