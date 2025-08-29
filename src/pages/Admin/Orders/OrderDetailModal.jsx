import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Grid, GridItem, Text, HStack, Checkbox, Select
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ApiService from "../../../reducers/api/Api.jsx";

export default function OrderDetailModal({ orderId, isOpen, onClose, onUpdated }) {
  const [order, setOrder] = useState(null);
  const load = async () => {
    if (!orderId) return;
    const o = await ApiService.get(`/orders/${orderId}`);
    setOrder(o);
  };
  useEffect(() => { if (isOpen) load(); }, [isOpen, orderId]);

  const updateStatus = async (status) => {
    await ApiService.patch(`/orders/${orderId}/status`, { status });
    await load();
    onUpdated?.();
  };

  const togglePicked = async (idx, picked) => {
    await ApiService.patch(`/orders/${orderId}/items/${idx}/picked`, { picked });
    await load();
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalles del Pedido: {order._id.slice(-6).toUpperCase()}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="1fr 1fr" gap={4}>
            <GridItem>
              <Text fontWeight="bold" mb={1}>Información del Cliente</Text>
              <Text>Nombre: {order.user?.name}</Text>
              <Text>Email: {order.user?.email}</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" mb={1}>Estado</Text>
                <Select value={order.status} onChange={(e) => updateStatus(e.target.value)}>
                  <option value="pending">Pendiente</option>
                  <option value="processing">En Proceso</option>
                  <option value="completed">Completado</option>
                </Select>

            </GridItem>
          </Grid>

          <Text mt={4} fontWeight="bold">Ítems del pedido</Text>
          {order.items.map((it, idx) => (
            <HStack key={idx} justify="space-between" py={2} borderBottom="1px solid #eee">
              <Text>{it.name} — {it.color} × {it.quantity}</Text>
              <HStack>
                <Text>${(it.price * it.quantity).toLocaleString("es-AR")}</Text>
                <Checkbox isChecked={it.picked} onChange={(e) => togglePicked(idx, e.target.checked)}>
                  Armado
                </Checkbox>
              </HStack>
            </HStack>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
