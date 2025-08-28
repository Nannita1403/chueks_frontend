import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import ApiService from "../../../reducers/api/Api.jsx"; //
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";

const CategoryPage = () => {
  const { id } = useParams(); // ej: mochilas, bolsos, etc.
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await ApiService.get(`/products?category=${id}`);
        setProducts(data.data || data);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  if (loading) return <Spinner size="xl" />;
  if (!products.length) return <Text>No hay productos en esta categoría</Text>;

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6} p={6}>
      {products.map((p) => (
        <ProductComponent key={p._id} product={p} />
      ))}
    </SimpleGrid>
  );
};

export default CategoryPage;
