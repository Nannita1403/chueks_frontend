import { useEffect, useState } from "react";
import {
  Box, VStack, Text, HStack, Button, Spinner, useDisclosure
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import ApiService from "../../../reducers/api/Api.jsx";

import EditNameModal from "../../../components/Profile/EditNameModal.jsx";
import AddressModal from "../../../components/Profile/AdressesModal.jsx";
import PhoneModal from "../../../components/Profile/PhoneModal.jsx";

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

  // ---- Traer pedidos
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

  // ---- Actualizar perfil
  const handleUpdateProfile = async (updatedFields) => {
    try {
      const res = await ApiService.patch("/users/update", updatedFields);
      setUser(prev => ({ ...prev, ...res.user }));
      toast({ title: "Datos actualizados", status: "success" });
    } catch (error) {
      toast({ title: error?.response?.data?.message || "Error al actualizar datos", status: "error" });
    }
  };

  // ---- Direcciones
  const handleAddAddress = async (data) => {
    if (!data.street?.trim() || !data.city?.trim() || !data.zip?.trim()) {
      toast({ title: "Completa todos los campos", status: "warning" });
      return;
    }
    const exists = user.addresses?.some(a => a.street === data.street && a.city === data.city && a.zip === data.zip);
    if (exists) {
      toast({ title: "Esta dirección ya existe", status: "warning" });
      return;
    }
    try {
      const res = await ApiService.post("/users/addresses", data);
      setUser(prev => ({ ...prev, addresses: res.user.addresses }));
      toast({ title: "Dirección añadida", status: "success" });
    } catch (error) {
      toast({ title: error?.response?.data?.message || "Error al añadir dirección", status: "error" });
    }
  };

  const handleUpdateAddress = async (id, data) => {
    if (!data.street?.trim() || !data.city?.trim() || !data.zip?.trim()) {
      toast({ title: "Completa todos los campos", status: "warning" });
      return;
    }
    try {
      const res = await ApiService.put(`/users/addresses/${id}`, data);
      setUser(prev => ({ ...prev, addresses: res.user.addresses }));
      toast({ title: "Dirección actualizada", status: "success" });
    } catch (error) {
      toast({ title: error?.response?.data?.message || "Error al actualizar dirección", status: "error" });
    }
  };

  // ---- Teléfonos
  const handleAddPhone = async (data) => {
    if (!data.number?.trim()) {
      toast({ title: "Ingresa un número válido", status: "warning" });
      return;
    }
    const exists = user.phones?.some(p => p.number === data.number);
    if (exists) {
      toast({ title: "Este número ya existe", status: "warning" });
      return;
    }
    try {
      const res = await ApiService.post("/users/phones", data);
      setUser(prev => ({ ...prev, phones: res.user.phones }));
      toast({ title: "Teléfono añadido", status: "success" });
    } catch (error) {
      toast({ title: error?.response?.data?.message || "Error al añadir teléfono", status: "error" });
    }
  };

  const handleUpdatePhone = async (id, data) => {
    if (!data.number?.trim()) {
      toast({ title: "Ingresa un número válido", status: "warning" });
      return;
    }
    try {
      const res = await ApiService.put(`/users/phones/${id}`, data);
      setUser(prev => ({ ...prev, phones: res.user.phones }));
      toast({ title: "Teléfono actualizado", status: "success" });
    } catch (error) {
      toast({ title: error?.response?.data?.message || "Error al actualizar teléfono", status: "error" });
    }
  };

  const defaultAddress = getDefaultAddress(user);
  const defaultPhone = getDefaultPhone(user);

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

      {/* Modales */}
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
      />
      <PhoneModal
        isOpen={isPhonesOpen}
        onClose={onClosePhones}
        initialValue={user?.phones || []}
        onSave={handleAddPhone}
        onUpdate={handleUpdatePhone}
      />
    </VStack>
  );
}
