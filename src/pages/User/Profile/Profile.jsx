import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Input,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Divider,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

import Header from "../../../components/Header/AppHeader.jsx";
import CustomButton from  "../../../components/Button/Button.jsx";
import {useToast} from "../../../Hooks/useToast.jsx";
import {useIsMobile} from "../../../Hooks/useMobile.jsx";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", telephone: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  const token = localStorage.getItem("token");
  const toast = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Obtener datos del usuario
    axios
      .get("/api/users/check-session", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setForm({
          name: res.data.user.name,
          telephone: res.data.user.telephone || "",
          address: res.data.user.address || "",
        });
      });

    // Obtener pedidos
    axios
      .get("/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));
  }, [token]);

  const handleUpdate = async () => {
    try {
      await axios.patch("/api/users/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast("Perfil actualizado correctamente ✅", "success");
    } catch {
      toast("Error al actualizar el perfil ❌", "error");
    }
  };

  const handlePassword = async () => {
    try {
      await axios.patch("/api/users/password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast("Contraseña cambiada ✅", "success");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch {
      toast("Error al cambiar contraseña ❌", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Box maxW={isMobile ? "100%" : "600px"} mx="auto" py={8} px={4}>
      <Header title="Mi Perfil" />

      {/* Datos */}
      <Box borderWidth="1px" borderRadius="lg" p={6} mb={6}>
        <Heading size="md" mb={4}>
          Datos personales
        </Heading>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Teléfono</FormLabel>
            <Input
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Dirección</FormLabel>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </FormControl>
          <CustomButton onClick={handleUpdate}>Guardar cambios</CustomButton>
        </VStack>
      </Box>

      {/* Cambiar contraseña */}
      <Box borderWidth="1px" borderRadius="lg" p={6} mb={6}>
        <Heading size="md" mb={4}>
          Cambiar contraseña
        </Heading>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Contraseña actual</FormLabel>
            <Input
              type="password"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Nueva contraseña</FormLabel>
            <Input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
          </FormControl>
          <CustomButton colorScheme="green" onClick={handlePassword}>
            Cambiar contraseña
          </CustomButton>
        </VStack>
      </Box>

      {/* Historial */}
      <Box borderWidth="1px" borderRadius="lg" p={6} mb={6}>
        <Heading size="md" mb={4}>
          Mis pedidos
        </Heading>
        {orders.length === 0 ? (
          <Text>No tienes pedidos todavía.</Text>
        ) : (
          <List spacing={3}>
            {orders.map((o) => (
              <ListItem key={o._id}>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Pedido {o._id} - {o.total}€ - {o.status}
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Logout */}
      <Divider my={6} />
      <CustomButton colorScheme="red" onClick={handleLogout}>
        Cerrar sesión
      </CustomButton>
    </Box>
  );
}
