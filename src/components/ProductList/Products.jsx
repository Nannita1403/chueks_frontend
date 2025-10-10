import React, { useEffect, useState } from "react";
import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductComponent from "./ProductComponent.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import { useToast } from "../../Hooks/useToast.jsx";

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
  if (!user) return toast({ title: "Debes iniciar sesión", status: "warning" });
  try {
    await toggleFavorite(product._id);

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
  if (loading) return <Spinner size="xl" />;
  if (!products.length) return <Text>No hay productos disponibles</Text>;

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6} p={4}>
      {products.map((product) => {
        const isFavorite = user?.favorites?.some(
          (fav) => fav._id === product._id
        );
        return (
          <ProductComponent
            key={product._id}
            product={product}
            isFavorite={user?.favorites?.some(fav => fav._id === product._id)}
            onToggleLike={() => handleToggleFavorite(product)}
            onViewDetail={() => handleViewDetail(product)}
          />
        );
      })}
    </SimpleGrid>
  );
};

export default Products;
