import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AddressModal({ isOpen, onClose }) {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    street: "",
    city: "",
    zip: "",
    country: "ES",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Simulación fetch inicial
  useEffect(() => {
    setAddresses([]); // aquí deberías hacer fetch a /api/users/addresses
  }, []);

  const validatePostalCode = async () => {
    if (!form.zip) return false;
    setLoading(true);
    try {
      if (["ES", "AR"].includes(form.country)) {
        const res = await axios.get(
          `https://api.zippopotam.us/${form.country}/${form.zip}`
        );
        if (res.status === 200) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.street || !form.city || !form.zip) {
      toast({ title: "Completa todos los campos", status: "warning" });
      return;
    }

    const isValid = await validatePostalCode();
    if (!isValid) {
      toast({
        title: "Error",
        description: "Código postal inválido para el país seleccionado",
        status: "error",
      });
      return;
    }

    if (editId) {
      // Update
      setAddresses(
        addresses.map((a) => (a.id === editId ? { ...form, id: editId } : a))
      );
      toast({ title: "Dirección actualizada", status: "success" });
    } else {
      // Create
      setAddresses([...addresses, { ...form, id: Date.now() }]);
      toast({ title: "Dirección guardada", status: "success" });
    }

    setForm({ street: "", city: "", zip: "", country: "ES" });
    setEditId(null);
    onClose();
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditId(addr.id);
    onClose(); // cerramos modal principal y luego se abre para editar
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editId ? "Editar Dirección" : "Nueva Dirección"}</ModalHeader>
        <ModalBody>
          <VStack spacing={3} align="stretch">
            <FormControl>
              <FormLabel>Calle</FormLabel>
              <Input
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Ciudad</FormLabel>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Código Postal</FormLabel>
              <Input
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>País</FormLabel>
              <Select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              >
                <option value="ES">España</option>
                <option value="AR">Argentina</option>
              </Select>
            </FormControl>
          </VStack>

          {/* Listado de direcciones guardadas */}
          {addresses.length > 0 && (
            <VStack mt={6} spacing={3} align="stretch">
              <Text fontWeight="bold">Mis Direcciones</Text>
              {addresses.map((addr) => (
                <Box
                  key={addr.id}
                  p={3}
                  bg="gray.100"
                  borderRadius="md"
                  shadow="sm"
                >
                  <Text>
                    {addr.street}, {addr.city} ({addr.zip}) [{addr.country}]
                  </Text>
                  <HStack mt={2}>
                    <Button
                      size="sm"
                      onClick={() => {
                        setForm(addr);
                        setEditId(addr.id);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() =>
                        setAddresses(addresses.filter((a) => a.id !== addr.id))
                      }
                    >
                      Eliminar
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="pink"
            onClick={handleSave}
            isLoading={loading}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
