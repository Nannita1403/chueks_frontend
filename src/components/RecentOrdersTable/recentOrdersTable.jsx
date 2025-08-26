import { Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Box } from "@chakra-ui/react"
import { FiEye } from "react-icons/fi"
import { Link } from "react-router-dom"

// Datos de ejemplo para pedidos recientes
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
  {
    id: "ORD-004",
    customer: "Carlos Rodríguez",
    date: "2023-05-07",
    total: 27600,
    status: "completed",
    items: 7,
  },
  {
    id: "ORD-005",
    customer: "Laura Martínez",
    date: "2023-05-06",
    total: 52300,
    status: "processing",
    items: 15,
  },
]

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

export function RecentOrdersTable() {
  return (
    <Box overflowX="auto">
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
                  <Button size="sm" variant="ghost" leftIcon={<FiEye />}>
                    Ver
                  </Button>
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
