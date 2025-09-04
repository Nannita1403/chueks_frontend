// src/components/ProductComponent/ProductComponent.jsx
import { Box, Image, Text, Flex, IconButton } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CustomButton from "../../components/Button/Button.jsx";

const ProductComponent = ({ product, onToggleLike, onViewDetail, isFavorite = false }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg="white"
      _dark={{ bg: "gray.800" }}
      _hover={{ shadow: "md", transform: "translateY(-2px)", transition: "all 0.2s" }}
    >
      {/* Imagen del producto */}
      <Image
        src={product.imgPrimary?.url || product.imgPrimary || "/placeholder.svg"}
        alt={product.name}
        mb={4}
        borderRadius="md"
        w="100%"
        h="200px"
        objectFit="cover"
      />

      {/* Info del producto */}
      <Text fontWeight="bold" fontSize="lg" mb={1}>
        {product.name}
      </Text>
      <Text fontSize="md" color="gray.600" mb={2}>
        ${product.priceMin}
      </Text>

      {/* Acciones */}
      <Flex align="center" gap={3} mt={3}>
        {/* Botón de favoritos */}
        <IconButton
          aria-label="Agregar a favoritos"
          icon={isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
          size="sm"
          variant="ghost"
          onClick={() => onToggleLike(!isFavorite)}
        />

        {/* Botón detalle */}
        <CustomButton size="sm" colorScheme="teal" onClick={onViewDetail}>
          Ver detalle
        </CustomButton>
      </Flex>
    </Box>
  );
};

export default ProductComponent;
