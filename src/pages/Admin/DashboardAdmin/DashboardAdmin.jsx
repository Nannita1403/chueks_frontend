import { useState, useEffect } from "react";
import {
  Box, Flex, HStack, Text, Heading, Button, Card, CardBody, CardHeader, Grid,
  Table, Thead, Tbody, Tr, Th, Td, Badge, IconButton, Alert, AlertIcon,
  AlertTitle, AlertDescription, useColorModeValue, Container, VStack,
} from "@chakra-ui/react";
import {
  FiPackage, FiShoppingCart, FiUsers, FiDollarSign,
  FiTrendingUp, FiTrendingDown, FiEye,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading/Loading.jsx";
import ApiService from "../../../reducers/api/Api.jsx";

const ICON_MAP = {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiPackage,
};

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);


  useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.get("/products/admin/dashboard");
      console.log("📊 Dashboard data:", data);

      // Crea las "stats" manualmente
      setStats([
        {
          title: "Stock bajo",
          value: data.lowStockCount,
          description: "Productos con menos de 3 unidades",
          icon: "FiPackage",
          trend: "down",
          percentage: "-",
        },
        {
          title: "Pedidos pendientes",
          value: data.pendingOrdersCount,
          description: "Pedidos en espera",
          icon: "FiShoppingCart",
          trend: "up",
          percentage: "+5%",
        },
      ]);

      setRecentOrders(data.recentPendingOrders || []);
      setLowStockProducts(data.lowStockProducts || []);

    } catch (error) {
      console.error("❌ Error al cargar dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, []);


  if (isLoading) return <Loading />;

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8}>
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={2}>Panel de Administración</Heading>
            <Text color="gray.600">Resumen general de la tienda</Text>
          </Box>

          {/* Stats */}
          <Grid
            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={{ base: 4, md: 6 }}
            w="full"
          >
            {stats.map((stat, i) => <StatsCard key={i} stat={stat} />)}
          </Grid>

          {/* Alert de stock/pedidos pendientes */}
          <Alert status="warning" borderRadius="lg" w="full">
            <AlertIcon />
            <Box>
              <AlertTitle>Atención requerida</AlertTitle>
              <AlertDescription>
                Hay {stats[0]?.value || 0} productos con stock bajo y {stats[1]?.value || 0} pedidos pendientes.
              </AlertDescription>
              <HStack spacing={2} mt={2}>
                <Link to="/admin/products?filter=low-stock">
                  <Button variant="outline" size="sm" colorScheme="yellow">Ver productos</Button>
                </Link>
                <Link to="/admin/orders?filter=pending">
                  <Button variant="outline" size="sm" colorScheme="yellow">Ver pedidos</Button>
                </Link>
              </HStack>
            </Box>
          </Alert>

          {/* Productos bajo Stock */}
          <Card w="full">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="md">Productos con stock bajo</Heading>
                  <Text color="gray.600" fontSize="sm">
                    Productos con alguna variante en stock ≤ 3 unidades
                  </Text>
                </Box>
                <Link to="/admin/products?filter=low-stock">
                  <Button variant="outline" size="sm">Ver todos</Button>
                </Link>
              </Flex>
            </CardHeader>

            <CardBody p={0}>
              {lowStockProducts.length === 0 ? (
                <Box p={4}><Text color="gray.500">No hay productos con stock bajo 🎉</Text></Box>
              ) : (
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Producto</Th>
                      <Th>Código</Th>
                      <Th>Colores en riesgo</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {lowStockProducts.map(product => (
                      <Tr key={product._id}>
                        <Td>{product.name}</Td>
                        <Td>{product.code}</Td>
                        <Td>
                          {product.colors.map((c, i) => (
                            <Badge key={i} colorScheme="red" mr={1}>
                              {c.name}: {c.stock}
                            </Badge>
                          ))}
                        </Td>
                        <Td>
                          <Link to={`/admin/products/${product._id}`}>
                            <IconButton aria-label="Ver" icon={<FiEye />} variant="ghost" size="sm" />
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>

          {/* Pedidos recientes */}
          <Card w="full">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="md">Pedidos Recientes</Heading>
                  <Text color="gray.600" fontSize="sm">Últimos pedidos realizados</Text>
                </Box>
                <Link to="/admin/orders">
                  <Button variant="outline" size="sm">Ver todos</Button>
                </Link>
              </Flex>
            </CardHeader>

            <CardBody p={0}>
              {/* Desktop */}
              <Box display={{ base: "none", md: "block" }}>
                <Table variant="simple" size="sm">
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
                    {recentOrders.map(order => (
                      <OrderRow key={order._id} order={order} />
                    ))}
                  </Tbody>
                </Table>
              </Box>

              {/* Mobile */}
              <Box display={{ base: "flex", md: "none" }} flexDir="column" gap={4} p={4}>
                {recentOrders.map(order => (
                  <MobileOrderCard key={order._id} order={order} />
                ))}
              </Box>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

// 🔹 StatsCard
function StatsCard({ stat }) {
  const Icon = ICON_MAP[stat.icon] || FiPackage;

  return (
    <Card>
      <CardBody p={{ base: 4, md: 6 }}>
        <Flex align="center" justify="space-between" mb={4}>
          <Text color="gray.500">{stat.title}</Text>
          <Box bg="gray.100" p={2} borderRadius="full">
            <Icon />
          </Box>
        </Flex>
        <Flex align="end" justify="space-between">
          <Box>
            <Text fontSize="2xl" fontWeight="bold">{stat.value}</Text>
            <Text fontSize="sm" color="gray.500">{stat.description}</Text>
          </Box>
          <Flex align="center" color={stat.trend === "up" ? "green.600" : "red.600"}>
            {stat.trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
            <Text fontSize="sm" ml={1}>{stat.percentage}</Text>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}

// 🔹 OrderStatusBadge
function OrderStatusBadge({ status }) {
  const statusConfig = {
    pending: { colorScheme: "yellow", label: "Pendiente" },
    processing: { colorScheme: "blue", label: "En proceso" },
    completed: { colorScheme: "green", label: "Completado" },
    cancelled: { colorScheme: "red", label: "Cancelado" },
  };

  const config = statusConfig[status] || { colorScheme: "gray", label: status || "Desconocido" };

  return (
    <Badge colorScheme={config.colorScheme} variant="subtle">
      {config.label}
    </Badge>
  );
}

// 🔹 OrderRow (para tabla desktop)
function OrderRow({ order }) {
  return (
    <Tr>
      <Td>{order.code || order._id}</Td>
      <Td>{order.user?.name || "—"}</Td>
      <Td>{new Date(order.createdAt).toLocaleDateString("es-AR")}</Td>
      <Td>{order.items}</Td>
      <Td>${(order.total ?? 0).toLocaleString("es-AR")}</Td>
      <Td><OrderStatusBadge status={order.status} /></Td>
      <Td>
        <Link to={`/admin/orders/${order._id}`}>
          <IconButton aria-label="Ver" icon={<FiEye />} variant="ghost" size="sm" />
        </Link>
      </Td>
    </Tr>
  );
}

// 🔹 MobileOrderCard (para móviles)
function MobileOrderCard({ order }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} shadow="sm">
      <Text fontWeight="bold">Pedido #{order.code || order._id}</Text>
      <Text>{order.user?.name || "—"}</Text>
      <Text fontSize="sm">{new Date(order.createdAt).toLocaleDateString("es-AR")}</Text>
      <Text>Productos: {order.items}</Text>
      <Text fontWeight="semibold">${(order.total ?? 0).toLocaleString("es-AR")}</Text>
      <OrderStatusBadge status={order.status} />
      <Link to={`/admin/orders/${order._id}`}>
        <Button size="sm" mt={2} leftIcon={<FiEye />}>Ver</Button>
      </Link>
    </Box>
  );
}

export default AdminDashboard;
