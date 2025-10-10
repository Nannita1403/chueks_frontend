import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, 
  Grid, GridItem, Text, HStack, Checkbox, Select, VStack, Image, Box, 
  Alert,
  AlertIcon,
  AlertDescription} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ApiService from "../../../reducers/api/Api.jsx";
import { useToast } from "@chakra-ui/react";

export default function OrderDetailModalAdmin({ orderId, isOpen, onClose, onUpdated }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  const load = async () => {
    try {
      if (!orderId) return;
      const o = await ApiService.get(`/orders/${orderId}`);
      setOrder(o);
      setError(null);
    } catch (err) {
      console.error("Error al cargar pedido:", err);
      setError("No se pudo cargar el pedido.");
    }
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen, orderId]);

  const updateStatus = async (status) => {
    try {
      await ApiService.patch(`/orders/${orderId}/status`, { status });
      await load();
      onUpdated?.();
      toast({
        title: "Estado actualizado",
        description: `El pedido ahora está en estado: ${status}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error al actualizar estado del pedido:", err);
      setError("No se pudo actualizar el estado del pedido.");
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

  const formatNumber = (num) => (num ?? 0).toLocaleString("es-AR");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "4xl" }} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pedido: {order.code ?? order._id?.slice(-6).toUpperCase()}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            <GridItem>
              <Text fontWeight="bold">Información del Cliente</Text>
              <Text>Nombre: {order.user?.name ?? "—"}</Text>
              <Text>Email: {order.user?.email ?? "—"}</Text>
              <Text>Dirección: {order.user?.address ?? "—"}</Text>
              <Text>Teléfono: {order.user?.phone ?? "—"}</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold">Estado del Pedido</Text>
              <Select
                value={order.status ?? "pending"}
                onChange={(e) => updateStatus(e.target.value)}
              >
                <option value="pending">Pendiente</option>
                <option value="processing">En Proceso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </Select>
            </GridItem>
          </Grid>
          <VStack mt={6} spacing={4} align="stretch">
            {(order.items ?? []).map((item, idx,) => {
              const displayName = item.name ?? "Artículo";
              const productId = item.productId ?? item.product?._id ?? "—";

              return (
                <Box key={item.productId || idx} border="1px solid #eee" borderRadius="md" p={4}>
                  <HStack align="start" spacing={4} flexDir={{ base: "column", md: "row" }}>
                    {item.imgPrimary ? (
                    <Image src={item.imgPrimary} alt={item.name} boxSize={{ base: "100%", md: "100px" }} objectFit="cover" borderTopRadius="md"
                      /> 
                      ) : ( 
                      <Box boxSize={{ base: "100%", md: "100px" }} bg="gray.200" borderRadius="md" display="flex" alignItems="center"
                      justifyContent="center"  >
                      <Text fontSize="sm" color="gray.500">Sin imagen</Text>
                    </Box>)}
                     <VStack align="start" spacing={1} flex="1" w="full">
                      <Text fontWeight="bold" fontSize="lg">{displayName}</Text>
                      <Text fontSize="sm" color="gray.500">Código: {item.code}</Text>
                      <Text fontSize="sm" color="gray.500">ID: {productId}</Text>
                      <Text fontSize="sm" color="gray.500">Category: {item.category}</Text>
                      <Text>Color: {item.color ?? "—"}</Text>
                      <Text>Precio Unitario: ${formatNumber(item.unitPrice)}</Text>
                      <Text fontWeight="bold">Total: ${formatNumber(item.totalPrice)}</Text>
                      <Checkbox
                        isChecked={item.picked ?? false}
                        onChange={(e) => togglePicked(idx, e.target.checked)}
                      >
                        Armado
                      </Checkbox>
                    </VStack>
                  </HStack>
                </Box>
              );
            })}
          </VStack>
          <Box mt={6} textAlign="right">
            <Text>Subtotal: ${formatNumber(order.subtotal)}</Text>
            <Text>Envío: ${formatNumber(order.shipping)}</Text>
            <Text fontWeight="bold">Total: ${formatNumber(order.total)}</Text>
          </Box>


        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
