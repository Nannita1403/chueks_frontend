import { Box, Image, Text, Flex, IconButton } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CustomButton from "../../components/Button/Button.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";

const ProductComponent = ({ product, onToggleLike, onViewDetail }) => {
  const { favorites } = useAuth();
  const isFavorite = favorites?.some((fav) => fav._id === product._id || fav === product._id);

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

      <Image
        src={product.imgPrimary?.url || product.imgPrimary || "/placeholder.svg"}
        alt={product.name}
        mb={4}
        borderRadius="md"
        w="100%"
        h="200px"
        objectFit="cover"
      />

      <Text fontWeight="bold" fontSize="lg" mb={1}>
        {product.name}
      </Text>
      <Text fontSize="md" color="gray.600" mb={2}>
        ${product.priceMin}
      </Text>

      <Flex align="center" gap={3} mt={3}>
        {/* Botón de favoritos */}
        <IconButton
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          icon={isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
          size="sm"
          variant="ghost"
          onClick={() => onToggleLike(product._id)}
        />

        <CustomButton size="sm" colorScheme="teal" onClick={onViewDetail}>
          Ver detalle
        </CustomButton>
      </Flex>
    </Box>
  );
};

export default ProductComponent;
