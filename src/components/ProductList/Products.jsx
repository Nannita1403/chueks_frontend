import React, { useEffect, useState } from "react";
import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductComponent from "./ProductComponent.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/products", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setProducts(response.data.data || response.data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  const handleToggleLike = async (product) => {
    if (!user) return;
    try {
      const isLiked = product.likes?.includes(user.id);
      const res = await axios.put(
        `http://localhost:3000/api/v1/products/toggleLike/${product._id}/${!isLiked}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? res.data.product : p))
      );
    } catch (err) {
      console.error("Error al togglear like:", err);
    }
  };

  const handleViewDetail = (product) => {
    navigate(`/products/${product._id}`);
  };

  if (loading) return <Spinner size="xl" />;
  if (!products.length) return <Text>No hay productos disponibles</Text>;

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6} p={4}>
      {products.map((product) => (
        <ProductComponent
          key={product._id}
          product={product}
          onToggleLike={() => handleToggleLike(product)}
          onViewDetail={() => handleViewDetail(product)}
        />
      ))}
    </SimpleGrid>
  );
};

export default Products;
