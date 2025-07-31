import React from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading
} from "@chakra-ui/react"

const InfoPanel = () => {

  return (
         <Flex w={{ base: "100%", md: "50%" }} bg="black" color="white" p={8} align="center" justify="center">
        <Box maxW="md">
          <VStack spacing={6} align="start">
            <Heading size="lg" color="white">
              Catálogo Exclusivo de Accesorios y Carteras
            </Heading>

            <VStack spacing={4} align="start">
              <Text color="gray.300">
                Bienvenido a CHUEKS, tu destino para accesorios y carteras de diseño exclusivo para venta mayorista.
              </Text>

              <VStack spacing={2} align="start">
                <HStack>
                  <Box w={4} h={4} borderRadius="full" bg="pink.500" />
                  <Heading size="sm" color="white">
                    Diseños Exclusivos
                  </Heading>
                </HStack>
                <Text color="gray.300" pl={6}>
                  Accede a nuestra colección de productos únicos y de alta calidad.
                </Text>
              </VStack>

              <VStack spacing={2} align="start">
                <HStack>
                  <Box w={4} h={4} borderRadius="full" bg="cyan.500" />
                  <Heading size="sm" color="white">
                    Información Detallada
                  </Heading>
                </HStack>
                <Text color="gray.300" pl={6}>
                  Consulta precios, colores, categorías y materiales de confección.
                </Text>
              </VStack>

              <VStack spacing={2} align="start">
                <HStack>
                  <Box w={4} h={4} borderRadius="full" bg="yellow.400" />
                  <Heading size="sm" color="white">
                    Listas Personalizadas
                  </Heading>
                </HStack>
                <Text color="gray.300" pl={6}>
                  Guarda tus favoritos y crea listas de compra para enviar al administrador.
                </Text>
              </VStack>
            </VStack>

            <Box pt={4}>
              <Text fontSize="sm" color="gray.400" fontStyle="italic">
                "Eleva tu negocio con nuestros productos exclusivos y de alta calidad."
              </Text>
            </Box>
          </VStack>
        </Box>
      </Flex>
  );
};

export default InfoPanel;
