import { Box, Container, Heading, Text, VStack, Image, Button } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import AppHeader from "../../../components/Header/AppHeader.jsx";

export default function OrderConfirm() {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get("orderId");

  return (
    <>
      <AppHeader />
      <Container maxW="container.sm" py={10} textAlign="center">
        <VStack spacing={5}>
          <Image src="/logoRedondo.png" alt="Logo" h="60px" />
          <Heading size="lg">¡Gracias! Tu pedido fue recibido.</Heading>
          {orderId && <Text color="gray.500">ID del pedido: {orderId}</Text>}
          <Text color="gray.600">
            Nuestro equipo se pondrá en contacto contigo dentro de las próximas <b>72 horas</b> para coordinar el pago y la entrega.
          </Text>
          <Link to="/home">
            <Button colorScheme="pink">Ir al inicio</Button>
          </Link>
        </VStack>
      </Container>
    </>
  );
}
