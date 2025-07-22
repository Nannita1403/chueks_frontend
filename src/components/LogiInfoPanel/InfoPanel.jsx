import React from 'react';
import { Box, VStack, Text, Heading, Flex,  } from '@chakra-ui/react';
//import { useColorModeValue } from '../ui/color-mode';

const InfoPanel = () => {

  return (
    <Flex  bg="brand.500" color="white" p={7} alignItems="center" justifyContent="center">
      <VStack spacing={3} textAlign="center">
        <Heading size="xl" textAlign="center">Catálogo Exclusivo de Accesorios y Carteras</Heading>
        <Text fontSize="xl" mr="2">
          Bienvenido a CHUEKS, tu destino para accesorios y carteras de diseño exclusivo para venta mayorista.
        </Text>     
    <Box>
      <Flex align="center" >
        <Box  w="1rem" h="1rem" bg="pink.500" borderRadius="full" mr={2} />
        <Heading align="center" as="h3" size="25px"> Diseños Exclusivos </Heading>
      </Flex>
       <Text color="gray.300" pl={6} size="xl">
        Accede a nuestra colección de productos únicos y de alta calidad.
      </Text>
    </Box>
       <Box>
      <Flex align="center" mb={1}>
        <Box  w="1rem" h="1rem" bg="cyan.400" borderRadius="full" mr={2} />
        <Heading align="center" as="h3" size="25px"> Información Detallada </Heading>
      </Flex>
      <Text color="gray.300" pl={6} size="xl">
        Consulta precios, colores, categorias y materiales de confección.
      </Text>
    </Box>
       <Box>
      <Flex align="center" mb={1}>
        <Box  w="1rem" h="1rem" bg="yellow.400" borderRadius="full" mr={2} />
        <Heading align="center" as="h3" size="25px"> Listas Personalizadas</Heading>
      </Flex>
      <Text color="gray.300" pl={6} size="xl">
      Guarda tus favoritos y crea listas de compra para enviar al administrador
      </Text>
    </Box>
      </VStack>
    </Flex>
  );
};

export default InfoPanel;
