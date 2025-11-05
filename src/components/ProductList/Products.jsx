import React, { useEffect, useState } from "react";
import { SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductComponent from "./ProductComponent.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import { useToast } from "../../Hooks/useToast.jsx";
import { ProductCardSkeleton } from "../Loading-Skeleton/loading-skeleton.jsx";


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, toggleFavorite } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://chueks-backend.vercel.app/api/v1/products",
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        setProducts(response.data.data || response.data);
      } catch (error) {
        console.error("Error cargando productos:", error);
        toast({ title: "Error cargando productos", status: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  const handleToggleFavorite = async (product) => {
    if (!user)
      return toast({ title: "Debes iniciar sesión", status: "warning" });
    try {
      const res = await toggleFavorite(product._id); 
      if (res?.favorites) {
      user.favorites = res.favorites;
    }
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );
    } catch (err) {
      console.error("❌ Error al togglear favorito:", err);
      toast({ title: "Error actualizando favoritos", status: "error" });
    }
  };

  const handleViewDetail = (product) => {
    navigate(`/products/${product._id}`);
  };

  if (loading) {
    return (
      <SimpleGrid columns={[1, 2, 3]} spacing={6} p={4}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </SimpleGrid>
    );
  }

  if (!products.length) {
    return (
      <VStack w="full" h="60vh" justify="center" spacing={4}>
        <Text fontSize="xl" color="gray.500">
          No hay productos disponibles
        </Text>
      </VStack>
    );
  }

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6} p={4}>
      {products.map((product) => {
        const isFavorite = user?.favorites?.some(
          (fav) => fav === product._id || fav._id === product._id
        );
        return (
          <ProductComponent
            key={product._id}
            product={product}
            isFavorite={isFavorite}
            onToggleLike={() => handleToggleFavorite(product)}
            onViewDetail={() => handleViewDetail(product)}
          />
        );
      })}
    </SimpleGrid>
  );
};

export default Products;
