import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Heading, Text, Flex, Button, useColorModeValue, VStack } from "@chakra-ui/react";
import { Image as ChakraImage } from "@chakra-ui/react";
import { useProducts } from "../../../context/Products/products.context.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import CustomButton from "../../../components/Button/Button.jsx";
import { ProductCardSkeleton } from "../../../components/Loading-Skeleton/loading-skeleton.jsx";
import { useToast } from "../../../Hooks/useToast.jsx";
import { HeartLoading } from "../../../components/Loading/Loading.jsx";
import ProductSEO from "../../../components/SEO/ProductSEO.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useProducts();
  const { user, token, toggleFavorite } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeLoading, setLikeLoading] = useState(false);

  const isLiked = !!product?.isFavorite;
  const bgCard = useColorModeValue("gray.50", "gray.800");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!token) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(
          `https://chueks-backend.vercel.app/api/v1/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProduct(res.data.product);
      } catch (err) {
        setError("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]);

const handleToggleLike = async () => {
  if (!user || !product) {
    return toast({
      title: "Debes iniciar sesión para dar like",
      status: "warning",
    });
  }

  try {
    setLikeLoading(true);
    const res = await toggleFavorite(product._id);
    setProduct((prev) => ({
      ...prev,
      isFavorite: res?.isFavorite ?? !prev.isFavorite,
      likes: res?.likes ?? (prev.isFavorite ? prev.likes - 1 : prev.likes + 1),
    }));

    toast({
      title: res?.isFavorite
        ? "Agregado a favoritos"
        : "Quitado de favoritos",
      status: "success",
    });
  } catch (err) {
    console.error(err);
    toast({ title: "Error al actualizar favoritos", status: "error" });
  } finally {
    setLikeLoading(false);
  }
};

  
  if (loading) return <ProductCardSkeleton />;
  if (error)
  return (
    <Box textAlign="center" p={6}> <Text color="red.500">{error}</Text>
    </Box>
  );

if (!product)
  return (
    <Box textAlign="center" p={6}> <Text>Producto no encontrado</Text>
    </Box>
  );

  return (
    <>
    <ProductSEO product={product} />
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">{product.name}</Heading>
        <Button colorScheme="teal" variant="outline" onClick={() => navigate(-1)}>⬅ Volver</Button>
      </Flex>

      <Box
        bg={bgCard} borderRadius="lg" p={4} shadow="md" transition="all 0.2s ease"
        _hover={{ shadow: "lg" }}>
       <ChakraImage src={product.imgPrimary || "/placeholder.svg"} alt={product.name} mb={4} borderRadius="md" maxH="400px" w="100%" objectFit="contain"/>
      
       <VStack align="start" spacing={3}>
      <Text>{product.description}</Text>
      <Text><strong>Precio Unitario:</strong> ${product.priceMin}</Text>
      <Text><strong>Precio Mayorista:</strong> ${product.priceMay}</Text>
      
      <Flex align="center" gap={2} mb={4}>
        <CustomButton
          onClick={handleToggleLike}
          isDisabled={likeLoading || !user}
          size="sm"
          colorScheme={isLiked ? "pink" : "gray"}
          variant={isLiked ? "solid" : "outline"}
        >
         {likeLoading ? (
           <HeartLoading size={18} />
              ) : (
           <>{isLiked ? "❤️" : "🤍"} {product.likes || 0}</>
           )}
        </CustomButton>
      </Flex>                                                                                                                                                                              

      <Text mb={1}><strong>Categoría:</strong> {product.category?.join(", ") || "N/A"}</Text>
      <Text mb={1}><strong>Estilos:</strong> {product.style?.join(", ") || "N/A"}</Text>
      <Text mb={1}><strong>Material:</strong> {product.material?.join(", ") || "N/A"}</Text>
                             
      <Box>
        <Text fontWeight="bold">Colores disponibles:</Text>
        {product.colors?.length ? (
        product.colors?.map((color, i) => (
          <Text key={i} fontSize="sm">
            {Array.isArray(color.name) ? color.name.join(", ") : color.name} ({color.stock ?? 0})
          </Text>                    
        ))
        ) : (
         <Text fontSize="sm" color="gray.500">
         No hay colores registrados
         </Text>
        )}
      </Box>
       </VStack>
      </Box>
    </Box>
    </>
  );
};               

export default ProductDetail;
