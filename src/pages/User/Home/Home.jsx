import React, { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ApiService from "../../../reducers/api/Api.jsx";
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";

const Home = () => {
  const [newSeasonProducts, setNewSeasonProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Lista de categorías fijas
  const categories = [
    { id: "mochilas", name: "Mochilas", color: "pink.400" },
    { id: "carteras", name: "Carteras", color: "cyan.400" },
    { id: "riñoneras", name: "Riñoneras", color: "yellow.400" },
    { id: "bolsos", name: "Bolsos", color: "green.400" },
    { id: "accesorios", name: "Accesorios", color: "red.400" },
  ];

  // 🔹 Códigos de productos destacados
  const featuredCodes = ["RI002", "BOL002", "BOL008A", "MO004", "NEC002", "TAR002"];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const products = await ApiService.get("/products"); // ✅ ahora ya es un array
        const featured = products.filter((p) => featuredCodes.includes(p.code));
        setNewSeasonProducts(featured);
      } catch (err) {
        console.error("Error cargando productos de nueva temporada:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={6}>
      {/* 🔹 Nueva Temporada */}
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        NUEVA TEMPORADA
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={12}>
        {newSeasonProducts.length > 0 ? (
          newSeasonProducts.map((product) => (
            <ProductComponent
              key={product._id}
              product={product}
              onViewDetail={() => {}}
              onToggleLike={() => {}}
            />
          ))
        ) : (
          <Text textAlign="center" w="100%">No hay productos destacados</Text>
        )}
      </SimpleGrid>

      {/* 🔹 Categorías */}
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        CATEGORÍAS
      </Heading>
      <SimpleGrid columns={[2, 3, 5]} spacing={6}>
        {categories.map((cat) => (
          <Link key={cat.id} to={`/category/${cat.id}`}>
            <Box
              bg={cat.color}
              borderRadius="lg"
              textAlign="center"
              p={6}
              color="white"
              fontWeight="bold"
              fontSize="lg"
              cursor="pointer"
              _hover={{ opacity: 0.9 }}
            >
              {cat.name}
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Home;
