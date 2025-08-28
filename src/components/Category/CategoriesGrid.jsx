import { Link } from "react-router-dom";
import { Box, Grid, Heading } from "@chakra-ui/react";

export default function CategoriesGrid({
  categories = [],
  title = "CATEGORÍAS",
}) {
  return (
    <Box>
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        {title}
      </Heading>
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
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
      </Grid>
    </Box>
  );
}