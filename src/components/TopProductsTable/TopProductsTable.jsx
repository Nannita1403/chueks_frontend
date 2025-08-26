import { Box, Text, Flex } from "@chakra-ui/react"
import { Link } from "react-router-dom"

// Datos de ejemplo para productos más vendidos
const topProducts = [
  {
    id: 1,
    name: "Cartera Milano",
    category: "Carteras",
    sales: 48,
    revenue: 600000,
    trend: "up",
  },
  {
    id: 2,
    name: "Mochila Urban",
    category: "Mochilas",
    sales: 42,
    revenue: 663600,
    trend: "up",
  },
  {
    id: 3,
    name: "Bolso Weekend",
    category: "Bolsos",
    sales: 36,
    revenue: 666000,
    trend: "down",
  },
  {
    id: 4,
    name: "Riñonera Sport",
    category: "Riñoneras",
    sales: 29,
    revenue: 258100,
    trend: "up",
  },
  {
    id: 5,
    name: "Cartera Mini",
    category: "Carteras",
    sales: 24,
    revenue: 235200,
    trend: "down",
  },
]

export function TopProductsTable() {
  return (
    <Box>
      {topProducts.map((product, index) => (
        <Link key={product.id} to={`/admin/products/${product.id}`}>
          <Flex
            align="center"
            justify="space-between"
            p={3}
            borderRadius="lg"
            _hover={{ bg: "gray.50" }}
            transition="background-color 0.2s"
            cursor="pointer"
          >
            <Flex align="center">
              <Flex w={8} h={8} align="center" justify="center" bg="gray.100" borderRadius="full" mr={3}>
                <Text fontWeight="medium" color="gray.700">
                  {index + 1}
                </Text>
              </Flex>
              <Box>
                <Text fontWeight="medium">{product.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {product.category}
                </Text>
              </Box>
            </Flex>
            <Box textAlign="right">
              <Text fontWeight="medium">{product.sales} ventas</Text>
              <Text fontSize="sm" color="gray.500">
                ${product.revenue.toLocaleString()}
              </Text>
            </Box>
          </Flex>
        </Link>
      ))}
    </Box>
  )
}
