import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";

export default function OrderModal({ isOpen, onClose, order }) {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pedido #{order._id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Text color="gray.500">
              Fecha: {new Date(order.createdAt).toLocaleDateString()}
            </Text>
            <Text>Estado: {order.status || "Pendiente"}</Text>
            <Divider />

            <Box>
              <Text fontWeight="bold" mb={2}>
                Productos:
              </Text>
              {order.items?.map((item) => (
                <Box
                  key={item._id}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  py={2}
                >
                  <Text>{item.product?.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    Cantidad: {item.quantity} × ${item.price} = $
                    {item.quantity * item.price}
                  </Text>
                </Box>
              ))}
            </Box>

            <Divider />
            <Text fontWeight="bold">Total: ${order.total}</Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
