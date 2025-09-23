import { Link } from "react-router-dom";
import { Box, Grid, Heading, Text } from "@chakra-ui/react";

export default function CategoriesGrid({
  categories = [],
  title = "CATEGORÍAS",
}) {
  return (
    <Box>
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        {title}
      </Heading>
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(6, 1fr)" }}
        gap={{ base: 3, md: 6 }}
      >
        {categories.map((cat) => (
          <Link key={cat.id} to={`/category/${cat.id}`}>
            <Box
              bg={cat.color}
              borderRadius="xl"
              textAlign="center"
              p={{ base: 3, md: 6 }}
              color="white"
              cursor="pointer"
              _hover={{ opacity: 0.9 }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              minH={{ base: "70px", md: "100px" }}
            >
              <Text
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                fontWeight="bold"
                whiteSpace="normal"
                wordBreak="break-word"
                textAlign="center"
              >
                {cat.name}
              </Text>
            </Box>
          </Link>
        ))}
      </Grid>
    </Box>
  );
}