import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useProducts } from "../../../context/Products/products.context.jsx";
import { useAuth } from "../../../context/Auth/auth.context.jsx";
import ProductComponent from "../../../components/ProductComponent/ProductComponent.jsx";

const Wishlist = () => {
  const { products } = useProducts();
  const { user } = useAuth();

  const wishlist = products.filter(p => p.likes?.includes(user?.id));

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>Mi Wishlist ❤️</Heading>
      {wishlist.length === 0 ? (
        <Text>No tienes productos en tu wishlist</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {wishlist.map(product => (
            <ProductComponent
              key={product._id}
              product={product}
              showAddToCart
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Wishlist;
