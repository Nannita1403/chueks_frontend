import { useState, useEffect } from "react"
import {
  Box,
  Flex,
  HStack,
  Text,
  Heading,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Container,
  VStack,
} from "@chakra-ui/react"
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiTrendingUp, FiTrendingDown, FiEye } from "react-icons/fi"
import { Link } from "react-router-dom"
import Loading from "../../../components/Loading/Loading.jsx"

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")
  const bgColor = useColorModeValue("white", "gray.800")

  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true)
      // Simulate API call for admin data
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }

    loadAdminData()
  }, [])

  const stats = [
    {
      title: "Ventas Totales",
      value: "$1,245,600",
      description: "Último mes",
      trend: "up",
      percentage: "12.5%",
      icon: FiDollarSign,
    },
    {
      title: "Pedidos",
      value: "156",
      description: "Último mes",
      trend: "up",
      percentage: "8.2%",
      icon: FiShoppingCart,
    },
    {
      title: "Clientes Nuevos",
      value: "48",
      description: "Último mes",
      trend: "down",
      percentage: "3.1%",
      icon: FiUsers,
    },
    {
      title: "Productos",
      value: "324",
      description: "Total en catálogo",
      trend: "up",
      percentage: "5.4%",
      icon: FiPackage,
    },
  ]

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "María López",
      date: "2023-05-10",
      total: 45800,
      status: "completed",
      items: 12,
    },
    {
      id: "ORD-002",
      customer: "Juan Pérez",
      date: "2023-05-09",
      total: 32500,
      status: "processing",
      items: 8,
    },
    {
      id: "ORD-003",
      customer: "Ana García",
      date: "2023-05-08",
      total: 18900,
      status: "pending",
      items: 5,
    },
  ]

  if (isLoading) {
    return <Loading />
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8}>
          <Box textAlign="center">
            <Heading size="xl" mb={2}>
              Panel de Administración
            </Heading>
            <Text color="gray.600">Resumen general de la tienda</Text>
          </Box>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} w="full">
            {stats.map((stat, index) => (
              <StatsCard key={index} stat={stat} />
            ))}
          </Grid>

          <Box w="full">
            <Alert status="warning" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Atención requerida</AlertTitle>
                <AlertDescription>
                  Hay 5 productos con stock bajo y 3 pedidos pendientes de más de 48 horas.
                </AlertDescription>
                <HStack spacing={2} mt={2}>
                  <Link to="/admin/products?filter=low-stock">
                    <Button variant="outline" size="sm" colorScheme="yellow">
                      Ver productos
                    </Button>
                  </Link>
                  <Link to="/admin/orders?filter=pending">
                    <Button variant="outline" size="sm" colorScheme="yellow">
                      Ver pedidos
                    </Button>
                  </Link>
                </HStack>
              </Box>
            </Alert>
          </Box>

          <Card w="full">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="md">Pedidos Recientes</Heading>
                  <Text color="gray.600" fontSize="sm">
                    Los últimos pedidos realizados
                  </Text>
                </Box>
                <Link to="/admin/orders">
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </Link>
              </Flex>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Cliente</Th>
                    <Th>Fecha</Th>
                    <Th>Productos</Th>
                    <Th>Total</Th>
                    <Th>Estado</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentOrders.map((order) => (
                    <Tr key={order.id}>
                      <Td>{order.id}</Td>
                      <Td>{order.customer}</Td>
                      <Td>{new Date(order.date).toLocaleDateString()}</Td>
                      <Td>{order.items}</Td>
                      <Td>${order.total.toLocaleString()}</Td>
                      <Td>
                        <OrderStatusBadge status={order.status} />
                      </Td>
                      <Td>
                        <Link to={`/admin/orders/${order.id}`}>
                          <IconButton aria-label="Ver" icon={<FiEye />} variant="ghost" size="sm" />
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}

function StatsCard({ stat }) {
  const IconComponent = stat.icon

  return (
    <Card>
      <CardBody p={6}>
        <Flex align="center" justify="space-between" mb={4}>
          <Text color="gray.500">{stat.title}</Text>
          <Box bg="gray.100" p={2} borderRadius="full">
            <IconComponent />
          </Box>
        </Flex>
        <Flex align="end" justify="space-between">
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              {stat.value}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {stat.description}
            </Text>
          </Box>
          <Flex align="center" color={stat.trend === "up" ? "green.600" : "red.600"}>
            {stat.trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
            <Text fontSize="sm" ml={1}>
              {stat.percentage}
            </Text>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  )
}

function OrderStatusBadge({ status }) {
  const statusConfig = {
    pending: { colorScheme: "yellow", label: "Pendiente" },
    processing: { colorScheme: "blue", label: "En proceso" },
    completed: { colorScheme: "green", label: "Completado" },
    cancelled: { colorScheme: "red", label: "Cancelado" },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <Badge colorScheme={config.colorScheme} variant="subtle">
      {config.label}
    </Badge>
  )
}

export default AdminDashboard
