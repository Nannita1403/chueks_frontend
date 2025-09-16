import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Grid, GridItem, Text, HStack, Checkbox, Select,
  VStack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ApiService from "../../../reducers/api/Api.jsx";

export default function OrderDetailModal({ orderId, isOpen, onClose, onUpdated }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
  try {
    if (!orderId) return;
    const o = await ApiService.get(`/orders/${orderId}`);
    setOrder(o);
    setError(null);
  }catch (err) {
      console.error("Error al cargar pedido:", err);
      setError("No se pudo cargar el pedido.");
    }
  };

  useEffect(() => { if (isOpen) load(); }, [isOpen, orderId]);

  const updateStatus = async (status) => {
  try {
    await ApiService.patch(`/orders/${orderId}/status`, { status });
    await load();
    onUpdated?.();
  }catch (err) {
      console.error("Error al cargar pedido:", err);
      setError("No se pudo cargar el pedido.");
    }
  };

  const togglePicked = async (idx, picked) => {
  try {
    await ApiService.patch(`/orders/${orderId}/items/${idx}/picked`, { picked });
    await load();
  } catch (err) {
      console.error("Error al marcar item como armado:", err);
    }
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
<ModalHeader>Detalles del Pedido: {order.code || order._id.slice(-6).toUpperCase()}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <Text color="red.500">{error}</Text>}

          <Grid templateColumns="1fr 1fr" gap={4}>
            <GridItem>
              <Text fontWeight="bold" mb={1}>Información del Cliente</Text>
              <Text>Nombre: {order.user?.name || "—"}</Text>
              <Text>Email: {order.user?.email || "—"}</Text>
            </GridItem>

            <GridItem>
              <Text fontWeight="bold" mb={1}>Estado del Pedido</Text>
                <Select value={order.status} onChange={(e) => updateStatus(e.target.value)}>
                  <option value="pending">Pendiente</option>
                  <option value="processing">En Proceso</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </Select>
            </GridItem>
          </Grid>

          <VStack align="stretch" mt={6} spacing={3}>
          <Text mt={4} fontWeight="bold">Ítems del pedido</Text>
          {order.items.map((item, idx) => (
            <HStack key={idx} justify="space-between" py={2} borderBottom="1px solid #eee">
               <VStack align="start" spacing={0}>
                  <Text>{item.name} {item.color && `(${item.color})`}</Text>
                  <Text fontSize="sm" color="gray.600">Cantidad: {item.quantity}</Text>
                </VStack>
                <HStack>
                  <Text fontWeight="bold">${item.totalPrice.toLocaleString("es-AR")}</Text>
                  <Checkbox
                    isChecked={item.picked}
                    onChange={(e) => togglePicked(idx, e.target.checked)}
                  >
                    Armado
                  </Checkbox>
                </HStack>
              </HStack>
            ))}
          </VStack>

          <VStack mt={6} spacing={1} align="flex-end">
            <Text>Subtotal: ${order.subtotal.toLocaleString("es-AR")}</Text>
            <Text>Envío: ${order.shipping.toLocaleString("es-AR")}</Text>
            <Text fontWeight="bold">Total: ${order.total.toLocaleString("es-AR")}</Text>
          </VStack>
          
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
