import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter,
  Input, Button, FormControl, FormLabel, useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ApiService from "../../reducers/api/Api.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";

export default function AddressPhoneModal({ isOpen, onClose, onConfirm }) {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setAddress(user?.address || "");
      setPhone(user?.phone || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!address || !phone) {
      toast({
        title: "Campos requeridos",
        description: "Debes completar ambos campos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      await ApiService.patch("/users/profile", { address, phone });
      await refreshUser?.();
      toast({ title: "Datos actualizados", status: "success" });
      onClose();
      onConfirm(); // continuar checkout
    } catch (err) {
      toast({
        title: "Error al guardar",
        description: err?.response?.data?.message || err.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Completa tus datos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired mb={4}>
            <FormLabel>Dirección</FormLabel>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Teléfono</FormLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="pink" onClick={handleSave} isLoading={loading} mr={3}>
            Confirmar y continuar
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
