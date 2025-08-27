import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Image, Heading, Text, Flex } from "@chakra-ui/react";
import { useProducts } from "../../../context/Products/products.context.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import { CustomButton } from "../../../components/Button/Button.jsx";
import { ProductCardSkeleton } from "../../../components/Loading-Skeleton/loading-skeleton.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const { dispatch } = useProducts();
  const { user, token } = useAuth(); // <-- usamos token separado

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeLoading, setLikeLoading] = useState(false);

  const isLiked = user ? product?.likes?.includes(user.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `http://localhost:3000/api/v1/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProduct(res.data.product);
      } catch (err) {
        console.error("Error al traer el producto:", err);
        setError(
          err.response?.status === 401
            ? "No autorizado. Por favor inicia sesión."
            : "No se pudo cargar el producto"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleToggleLike = async () => {
    if (!user || !product) return;

    try {
      setLikeLoading(true);
      const res = await axios.put(
        `http://localhost:3000/api/v1/products/toggleLike/${product._id}/${!isLiked}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProduct(res.data.product);
      dispatch({ type: "UPDATE_PRODUCT", payload: res.data.product });
    } catch (err) {
      console.error("Error al actualizar like:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) return <ProductCardSkeleton />;

  if (error)
    return (
      <Box textAlign="center" p={6}>
        <Text color="red.500">{error}</Text>
      </Box>
    );

  if (!product)
    return (
      <Box textAlign="center" p={6}>
        <Text>Producto no encontrado</Text>
      </Box>
    );

  return (
    <Box p={6}>
      <Heading mb={4}>{product.name}</Heading>
      <Image
        src={product.imgPrimary || "/placeholder.svg"}
        alt={product.name}
        mb={4}
        borderRadius="md"
      />
      <Text mb={2}>{product.description}</Text>
      <Text mb={2}>
        <strong>Precio Unitario:</strong> ${product.priceMin}
      </Text>
      <Text mb={2}>
        <strong>Precio Mayorista:</strong> ${product.priceMay}
      </Text>

      <Flex align="center" gap={2} mb={4}>
        <CustomButton
          onClick={handleToggleLike}
          isDisabled={likeLoading || !user}
          size="sm"
        >
          {isLiked ? "❤️" : "🤍"} {product.likes?.length || 0}
        </CustomButton>
      </Flex>

      <Text mb={1}>
        <strong>Categoría:</strong> {product.category?.join(", ") || "N/A"}
      </Text>
      <Text mb={1}>
        <strong>Estilos:</strong> {product.style?.join(", ") || "N/A"}
      </Text>
      <Text mb={1}>
        <strong>Material:</strong> {product.material?.join(", ") || "N/A"}
      </Text>

      <Box>
        <Text fontWeight="bold">Colores disponibles:</Text>
        {product.colors?.map((color, i) => (
          <Text key={i} fontSize="sm">
            {Array.isArray(color.name) ? color.name.join(", ") : color.name} (
            {color.stock ?? 0})
          </Text>
        ))}
      </Box>
    </Box>
  );
};

export default ProductDetail;
