import { useEffect, useState } from "react";
import { Box, Text, Flex, IconButton, Image as ChakraImage, useColorModeValue } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CustomButton from "../../components/Button/Button.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import { HeartLoading } from "../../components/Loading/Loading.jsx";

const ProductComponent = ({ product, onToggleLike, onViewDetail }) => {
  const { favorites } = useAuth();
  const [likeLoading, setLikeLoading] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(false); // 👈 estado local para el corazón

  useEffect(() => {
    const fav = favorites?.some(
      (f) => f._id === product._id || f === product._id
    );
    setLocalFavorite(fav);
  }, [favorites, product._id]);

  const handleToggleLike = async () => {
    try {
      setLikeLoading(true);
      setLocalFavorite((prev) => !prev); // 👈 cambio visual inmediato
      await onToggleLike(product._id);
    } catch (error) {
      console.error("Error al cambiar favorito:", error);
      setLocalFavorite((prev) => !prev); // 👈 revertir si falla
    } finally {
      setTimeout(() => setLikeLoading(false), 200);
    }
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg={cardBg}
      _hover={{
        shadow: "lg",
        transform: "translateY(-4px)",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <ChakraImage
        src={product?.imgPrimary?.url || product?.imgPrimary || "/placeholder.svg"}
        alt={product?.name || "Producto"}
        mb={4}
        borderRadius="md"
        w="100%"
        h="200px"
        objectFit="cover"
        loading="lazy"
      />

      <Text fontWeight="bold" fontSize="lg" mb={1} noOfLines={1}>
        {product?.name || "Producto sin nombre"}
      </Text>

      <Text fontSize="md" color="gray.600" mb={2}>
        ${product?.priceMin ?? "—"}
      </Text>

      <Flex align="center" gap={3} mt={3}>
        <IconButton
          aria-label={localFavorite ? "Quitar de favoritos" : "Agregar a favoritos"} // 👈 usa localFavorite
          aria-pressed={localFavorite}
          icon={
            likeLoading ? (
              <HeartLoading size={18} />
            ) : localFavorite ? ( // 👈 usa localFavorite
              <FaHeart color="red" />
            ) : (
              <FaRegHeart />
            )
          }
          size="sm"
          variant="ghost"
          onClick={handleToggleLike}
          isDisabled={likeLoading}
        />

        <CustomButton size="sm" colorScheme="teal" onClick={onViewDetail}>
          Ver detalle
        </CustomButton>
      </Flex>
    </Box>
  );
};

export default ProductComponent;
