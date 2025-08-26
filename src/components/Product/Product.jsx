import { Link } from "react-router-dom";
import { Flex, Box, Text, Image } from "@chakra-ui/react";
import { useProducts } from "../../context/Products/products.context.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import ProductsActions from "../../reducers/products/products.actions.jsx";
import { CustomButton } from "../../components/Button/Button.jsx";
import { CustomCard } from "../../components/Card/Card.jsx";

const Product = ({ product }) => {
  const { products, dispatch: productsDispatch } = useProducts();
  const { user } = useAuth();

  const isLiked = user ? product?.likes?.includes(user._id) : false;

  const handleToggleLike = async () => {
    if (!user) return;

    try {
      // Alternamos el like
      const updatedProduct = await ProductsActions.toggleLike(
        product._id,
        !isLiked, // true si queremos agregar, false si queremos quitar
        user._id // enviamos el ID del usuario
      );

      // Actualizamos el estado local de productos
      productsDispatch({
        type: "UPDATE_PRODUCT",
        payload: updatedProduct,
      });
    } catch (error) {
      console.error(`[toggleLike] Error toggling like para producto ${product._id}:`, error);
    }
  };

  return (
    <Flex
      direction="column"
      gap="4"
      p="4"
      border="1px solid #eee"
      borderRadius="lg"
    >
      {/* Botón Like */}
      <CustomCard
        onClick={handleToggleLike}
        style={{
          cursor: user ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px",
        }}
      >
        <Text color={isLiked ? "red" : "black"} fontWeight="bold">
          {product?.likes?.length || 0}
        </Text>
        <Image
          src={isLiked ? "/icons/corazon-relleno.png" : "/icons/corazon-vacio.png"}
          alt={isLiked ? "Liked" : "Not liked"}
          boxSize={5}
        />
      </CustomCard>

      {/* Imagen */}
      <Box>
        <Image
          src={product?.imgPrimary || "/placeholder.svg"}
          alt={product?.name || "Producto"}
          borderRadius="8px"
          objectFit="cover"
          width="100%"
        />
      </Box>

      {/* Información del producto */}
      <Box>
        <Text fontWeight="bold" fontSize="lg" mb={1}>
          {product?.name || "Sin nombre"}
        </Text>
        <Text fontSize="sm" mb={2}>
          {product?.description || "Sin descripción"}
        </Text>

        <Box mb={2}>
          <Text fontSize="sm">
            <strong>Precio Unitario:</strong> ${product?.priceMin ?? "N/A"}
          </Text>
          <Text fontSize="sm">
            <strong>Mayorista:</strong> ${product?.priceMay ?? "N/A"}
          </Text>
        </Box>

        <Text fontSize="sm">
          <strong>Categoría:</strong> {product?.category?.join(", ") || "N/A"}
        </Text>
        <Text fontSize="sm" mb={2}>
          <strong>Estilo:</strong> {product?.style?.join(", ") || "N/A"}
        </Text>

        {/* Colores */}
        <Box>
          {product?.colors?.map((color, i) => (
            <Text key={i} fontSize="xs" display="inline-block" mr={2}>
              {Array.isArray(color.name) ? color.name.join(", ") : color.name} ({color.stock ?? 0})
            </Text>
          ))}
        </Box>
      </Box>

      {/* Ver Producto */}
      <CustomCard>
        <CustomButton width="auto">
          <Link to={`/product/${product?._id}`}>Ver Producto</Link>
        </CustomButton>
      </CustomCard>
    </Flex>
  );
};

export default Product;
