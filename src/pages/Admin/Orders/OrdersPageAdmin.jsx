"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Flex,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react"
import { FiSearch, FiFilter, FiEye, FiDownload } from "react-icons/fi"

// Datos de ejemplo para pedidos
const orders = [
  {
    id: "ORD-001",
    customer: "María López",
    email: "maria.lopez@example.com",
    date: "2023-05-10T14:30:00",
    total: 45800,
    status: "completed",
    items: [
      { id: 1, name: "Cartera Milano", color: "Negro", quantity: 2, price: 12500 },
      { id: 2, name: "Mochila Urban", color: "Azul", quantity: 1, price: 15800 },
      { id: 3, name: "Riñonera Sport", color: "Negro", quantity: 1, price: 8900 },
    ],
    shippingAddress: {
      street: "Av. Corrientes 1234",
      city: "Buenos Aires",
      state: "CABA",
      postalCode: "C1043AAZ",
      country: "Argentina",
    },
    paymentMethod: "Transferencia bancaria",
    notes: "Entregar en horario comercial",
  },
  // ... más pedidos
]

const OrderStatusBadge = ({ status }) => {
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

export default function OrdersPageAdmin() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedOrders, setSelectedOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Filtrar pedidos
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "" || order.status === selectedStatus
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && order.status === "pending") ||
      (activeTab === "processing" && order.status === "processing") ||
      (activeTab === "completed" && order.status === "completed")
    return matchesSearch && matchesStatus && matchesTab
  })

  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    onOpen()
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Pedidos</Heading>
          <Text color="gray.600">Gestiona y da seguimiento a los pedidos</Text>
        </Box>
        <Button leftIcon={<FiDownload />} variant="outline">
          Exportar
        </Button>
      </Flex>

      <Tabs value={activeTab} onChange={setActiveTab} mb={6}>
        <TabList>
          <Tab>Todos</Tab>
          <Tab>Pendientes</Tab>
          <Tab>En Proceso</Tab>
          <Tab>Completados</Tab>
        </TabList>
      </Tabs>

      <Flex justify="space-between" align="center" mb={6} gap={4}>
        <InputGroup maxW="md">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por ID o cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Flex gap={2}>
          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} w="180px">
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="processing">En proceso</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </Select>
          <Button variant="outline" leftIcon={<FiFilter />}>
            Filtros
          </Button>
        </Flex>
      </Flex>

      <Card>
        <CardBody p={0}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>
                  <Checkbox />
                </Th>
                <Th>ID</Th>
                <Th>Cliente</Th>
                <Th>Fecha</Th>
                <Th>Total</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredOrders.map((order) => (
                <Tr key={order.id}>
                  <Td>
                    <Checkbox />
                  </Td>
                  <Td fontWeight="medium">{order.id}</Td>
                  <Td>
                    <Box>
                      <Text fontWeight="medium">{order.customer}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {order.email}
                      </Text>
                    </Box>
                  </Td>
                  <Td>
                    {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
                  </Td>
                  <Td>${order.total.toLocaleString()}</Td>
                  <Td>
                    <OrderStatusBadge status={order.status} />
                  </Td>
                  <Td>
                    <Button size="sm" variant="ghost" leftIcon={<FiEye />} onClick={() => viewOrderDetails(order)}>
                      Ver
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal de detalles del pedido */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="md">Detalles del Pedido: {selectedOrder?.id}</Heading>
                <Text color="gray.600" fontSize="sm">
                  Realizado el {selectedOrder && new Date(selectedOrder.date).toLocaleDateString()}
                </Text>
              </Box>
              <OrderStatusBadge status={selectedOrder?.status} />
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedOrder && (
              <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
                <Box>
                  <Heading size="sm" mb={2}>
                    Información del Cliente
                  </Heading>
                  <Text>
                    <strong>Nombre:</strong> {selectedOrder.customer}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {selectedOrder.email}
                  </Text>
                </Box>
                <Box>
                  <Heading size="sm" mb={2}>
                    Dirección de Envío
                  </Heading>
                  <Text>{selectedOrder.shippingAddress.street}</Text>
                  <Text>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                    {selectedOrder.shippingAddress.postalCode}
                  </Text>
                  <Text>{selectedOrder.shippingAddress.country}</Text>
                </Box>
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
