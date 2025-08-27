import { useParams } from "react-router-dom"
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { useProducts } from "../../../context/Products/products.context.jsx"
import Product from "../Product/Product.jsx"

const CategoryPage = () => {
  const { id } = useParams()
  const { products } = useProducts()

  // Filtramos productos que incluyan la categoría en su array
  const filteredProducts = products.filter(p => p.category?.includes(id))

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        Categoría: {id}
      </Heading>

      {filteredProducts.length === 0 ? (
        <Text>No hay productos en esta categoría.</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {filteredProducts.map(product => (
            <Product key={product._id} product={product} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}

export default CategoryPage
