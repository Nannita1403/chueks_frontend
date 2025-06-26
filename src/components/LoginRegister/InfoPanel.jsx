import React from 'react';
import { Box, VStack, Text, Heading, Flex,  } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

const InfoPanel = () => {
  const bg = useColorModeValue('brand.50', 'gray.700');
  const color = useColorModeValue('brand.700', 'whiteAlpha.900');

  return (
    <Box flex="1" bg={bg} color={color} p={10} display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4} textAlign="center">
        <Heading size="3xl" textAlign="center">Catálogo Exclusivo de Accesorios y Carteras</Heading>
        <Text fontSize="xl" semibold mr={2}>
          Bienvenido a CHUEKS, tu destino para accesorios y carteras de diseño exclusivo para venta mayorista.
        </Text>     
    <Box>
      <Flex align="left" mb={1}>
        <Box  w="1rem" h="1rem" bg="pink.500" borderRadius="full" mr={2} semibold/>
        <Heading as="h3" size="2xl"> Diseños Exclusivos </Heading>
      </Flex>
      <Text color="gray.300" pl={6} size="xl">
        Accede a nuestra colección de productos únicos y de alta calidad.
      </Text>
    </Box>
       <Box>
      <Flex align="left" mb={1}>
        <Box  w="1rem" h="1rem" bg="cyan.400" borderRadius="full" mr={2} semibold/>
        <Heading as="h3" size="2xl"> Información Detallada </Heading>
      </Flex>
      <Text color="gray.300" pl={6} size="xl">
        Consulta precios, colores, categorias y materiales de confección.
      </Text>
    </Box>
       <Box>
      <Flex align="left" mb={1}>
        <Box  w="1rem" h="1rem" bg="yellow.400" borderRadius="full" mr={2} semibold/>
        <Heading as="h3" size="2xl"> Listas Personalizadas</Heading>
      </Flex>
      <Text color="gray.300" pl={6} size="xl">
      Guarda tus favoritos y crea listas de compra para enviar al administrador
      </Text>
    </Box>
      </VStack>
    </Box>
  );
};

export default InfoPanel;
