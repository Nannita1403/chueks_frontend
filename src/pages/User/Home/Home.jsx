
import { useState, useEffect } from "react"
import { Box, Container, Grid, Text, VStack } from "@chakra-ui/react"
import Loading from "../../components/Loading/Loading.jsx"

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }

    loadData()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8}>
          <Text fontSize="3xl" fontWeight="bold">
            Dashboard de Productos
          </Text>
          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} w="full">
            {/* Product cards will go here */}
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}

export default DashboardPage
