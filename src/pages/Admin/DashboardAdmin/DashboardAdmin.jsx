import { useState, useEffect } from "react";
import {
  Box, Flex, HStack, Text, Heading, Button, Card, CardBody, CardHeader, Grid,
  Table, Thead, Tbody, Tr, Th, Td, Badge, Container, VStack,
  GridItem, Tooltip,
} from "@chakra-ui/react";
import {
  FiPackage, FiShoppingCart, FiUsers, FiDollarSign,
  FiTrendingUp, FiTrendingDown,
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
        const data = await ApiService.get("/products/dashboard");

        setStats([
          {
            alert: true,
            title: "⚠ Atención requerida",
            description: `Hay ${data.lowStockCount} productos con stock bajo y ${data.pendingOrdersCount} pedidos pendientes.`,
          },
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

        setRecentOrders(data.recentOrders || []);
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
          <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={{ base: 4, md: 6 }} w="full">
            {stats.map((stat, i) => <StatsCard key={i} stat={stat} />)}
          </Grid>

          {/* Pedidos recientes */}
          <Card w="full" mt={6}>
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
              <Box display={{ base: "none", md: "block" }}>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Cliente</Th>
                      <Th>Fecha</Th>
                      <Th>Producto</Th>
                      <Th>Total</Th>
                      <Th>Estado</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recentOrders.map(order => (
                      <OrderRow key={order._id} order={order} />
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Box display={{ base: "flex", md: "none" }} flexDir="column" gap={4} p={4}>
                {recentOrders.map(order => (
                  <MobileOrderCard key={order._id} order={order} />
                ))}
              </Box>
            </CardBody>
          </Card>

          {/* Productos bajo stock */}
          <Card w="full" mt={6}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Box>
                  <Heading size="md">Productos con stock bajo</Heading>
                  <Text color="gray.600" fontSize="sm">
                    Agrupados por nivel de riesgo
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
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* Stock crítico (≤ 3) */}
                    <Tr>
                      <Td colSpan={3}>
                        <Heading size="sm" my={2} color="red.500">🟥 Stock crítico (≤ 3)</Heading>
                      </Td>
                    </Tr>
                    {lowStockProducts
                      .filter(p => p.colors.some(c => c.stock <= 3))
                      .map(p => <LowStockRow key={p._id} product={p} threshold={3} />)}

                    {/* Stock bajo (4 a 5) */}
                    <Tr>
                      <Td colSpan={3}>
                        <Heading size="sm" my={4} color="orange.500">🟧 Stock bajo (≤ 5)</Heading>
                      </Td>
                    </Tr>
                    {lowStockProducts
                      .filter(p => p.colors.some(c => c.stock > 3 && c.stock <= 5))
                      .map(p => <LowStockRow key={p._id + "-low"} product={p} threshold={5} />)}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

function LowStockRow({ product, threshold }) {
  const filteredColors = product.colors.filter(c =>
    threshold === 3 ? c.stock <= 3 : (c.stock > 3 && c.stock <= 5)
  );

  return (
    <Tr>
      <Td>{product.name}</Td>
      <Td>{product.code}</Td>
      <Td>
        <VStack align="start" spacing={1}>
          {filteredColors.map((c, i) => (
            <HStack key={i} spacing={2}>
              <Tooltip label={c.name} hasArrow>
                <Box
                  w="16px"
                  h="16px"
                  borderRadius="full"
                  bg={c.hex || "gray.400"}
                  border="1px solid #ccc"
                  cursor="pointer"
                />
              </Tooltip>
              <Text fontSize="sm">{c.stock}</Text>
            </HStack>
          ))}
        </VStack>
      </Td>
    </Tr>
  );
}


function StatsCard({ stat }) {
  if (stat.alert) {
    return (
      <GridItem colSpan={{ base: 1, md: 2 }} w="full">
        <Card bg="orange.100" h="100%">
          <CardBody>
            <Heading size="sm" mb={2}>{stat.title}</Heading>
            <Text fontSize="sm" mb={2}>{stat.description}</Text>
            <HStack spacing={2}>
              <Link to="/admin/products?filter=low-stock">
                <Button variant="outline" size="sm" colorScheme="orange">Ver productos</Button>
              </Link>
              <Link to="/admin/orders?filter=pending">
                <Button variant="outline" size="sm" colorScheme="orange">Ver pedidos</Button>
              </Link>
            </HStack>
          </CardBody>
        </Card>
      </GridItem>
    );
  }

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

function OrderStatusBadge({ status }) {
  const statusConfig = {
    pending: { colorScheme: "yellow", label: "Pendiente" },
    processing: { colorScheme: "blue", label: "En proceso" },
    completed: { colorScheme: "green", label: "Completado" },
    cancelled: { colorScheme: "red", label: "Cancelado" },
  };
  const config = statusConfig[status] || { colorScheme: "gray", label: status || "Desconocido" };
  return <Badge colorScheme={config.colorScheme} variant="subtle">{config.label}</Badge>;
}

// 🔸 Mostrar solo primera categoría del pedido
function CategorySummary({ items }) {
  const firstCategory = items[0]?.product?.category || "Sin categoría";
  const quantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Text fontSize="sm">
      {firstCategory}: {quantity}
    </Text>
  );
}

function OrderRow({ order }) {
  return (
    <Tr>
      <Td>{order.code || order._id}</Td>
      <Td>{order.user?.name || "—"}</Td>
      <Td>{new Date(order.createdAt).toLocaleDateString("es-AR")}</Td>
      <Td><CategorySummary items={order.items} /></Td>
      <Td>${(order.total ?? 0).toLocaleString("es-AR")}</Td>
      <Td><OrderStatusBadge status={order.status} /></Td>
    </Tr>
  );
}

function MobileOrderCard({ order }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} shadow="sm">
      <Text fontWeight="bold">Pedido #{order.code || order._id}</Text>
      <Text>{order.user?.name || "—"}</Text>
      <Text fontSize="sm">{new Date(order.createdAt).toLocaleDateString("es-AR")}</Text>
      <Box mt={2}><CategorySummary items={order.items} /></Box>
      <Text fontWeight="semibold" mt={2}>${(order.total ?? 0).toLocaleString("es-AR")}</Text>
      <OrderStatusBadge status={order.status} />
    </Box>
  );
}

export default AdminDashboard;
