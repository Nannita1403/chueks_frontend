import React from 'react';
import { Box, VStack, Text, Heading,  } from '@chakra-ui/react';
import { useColorModeValue } from '../../components/ui/color-mode';

const InfoPanel = () => {
  const bg = useColorModeValue('brand.50', 'gray.700');
  const color = useColorModeValue('brand.700', 'whiteAlpha.900');

  return (
    <Box flex="1" bg={bg} color={color} p={10} display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4} textAlign="center">
        <Heading size="lg">¡Bienvenido a Chueks!</Heading>
        <Text fontSize="md">
          Inicia sesión o crea una cuenta para comenzar a explorar nuestros productos exclusivos y acceder a tus favoritos.
        </Text>
        <Text fontSize="sm" color="gray.500">
          ¡Te esperamos con muchas sorpresas!
        </Text>
      </VStack>
    </Box>
  );
};

export default InfoPanel;
