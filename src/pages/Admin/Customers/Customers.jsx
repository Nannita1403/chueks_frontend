import { useState } from "react"
import { Box, Card, CardBody, Heading, Text, Button, Input, InputGroup, InputLeftElement, Select,
  Badge, Table, Thead, Tbody, Tr, Th, Td, Avatar, Flex, Grid, Stat, StatLabel, StatNumber, StatHelpText,
} from "@chakra-ui/react"
import { FiSearch, FiFilter, FiEye, FiDownload, FiUsers, FiUserPlus, FiUserCheck } from "react-icons/fi"

const customers = [
  {
    id: 1,
    name: "María López",
    email: "maria.lopez@example.com",
    phone: "+54 11 1234-5678",
    registrationDate: "2023-01-15",
    totalOrders: 12,
    totalSpent: 156800,
    status: "active",
    lastOrder: "2023-05-10",
    favoriteCategory: "Carteras",
  },
  {
    id: 2,
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "+54 11 2345-6789",
    registrationDate: "2023-02-20",
    totalOrders: 8,
    totalSpent: 89500,
    status: "active",
    lastOrder: "2023-05-09",
    favoriteCategory: "Mochilas",
  },
  // ... más clientes
]

const CustomerStatusBadge = ({ status }) => {
  const statusConfig = {
    active: { colorScheme: "green", label: "Activo" },
    inactive: { colorScheme: "gray", label: "Inactivo" },
    blocked: { colorScheme: "red", label: "Bloqueado" },
  }

  const config = statusConfig[status] || statusConfig.active

  return (
    <Badge colorScheme={config.colorScheme} variant="subtle">
      {config.label}
    </Badge>
  )
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  // Filtrar clientes
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "" || customer.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Estadísticas
  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "active").length
  const newCustomersThisMonth = customers.filter(
    (c) => new Date(c.registrationDate).getMonth() === new Date().getMonth(),
  ).length

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Clientes</Heading>
          <Text color="gray.600">Gestiona la información de tus clientes</Text>
        </Box>
        <Button leftIcon={<FiDownload />} variant="outline">
          Exportar
        </Button>
      </Flex>

      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} mb={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Clientes</StatLabel>
              <StatNumber>{totalCustomers}</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <FiUsers />
                  <Text ml={1}>Registrados</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Clientes Activos</StatLabel>
              <StatNumber>{activeCustomers}</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <FiUserCheck />
                  <Text ml={1}>Con pedidos recientes</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Nuevos Este Mes</StatLabel>
              <StatNumber>{newCustomersThisMonth}</StatNumber>
              <StatHelpText>
                <Flex align="center">
                  <FiUserPlus />
                  <Text ml={1}>Registros nuevos</Text>
                </Flex>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      <Flex justify="space-between" align="center" mb={6} gap={4}>
        <InputGroup maxW="md">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Flex gap={2}>
          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} w="180px">
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="blocked">Bloqueado</option>
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
                <Th>Cliente</Th>
                <Th>Contacto</Th>
                <Th>Registro</Th>
                <Th>Pedidos</Th>
                <Th>Total Gastado</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCustomers.map((customer) => (
                <Tr key={customer.id}>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" name={customer.name} mr={3} />
                      <Box>
                        <Text fontWeight="medium">{customer.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          ID: {customer.id}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td>
                    <Box>
                      <Text fontSize="sm">{customer.email}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {customer.phone}
                      </Text>
                    </Box>
                  </Td>
                  <Td>{new Date(customer.registrationDate).toLocaleDateString()}</Td>
                  <Td>
                    <Text fontWeight="medium">{customer.totalOrders}</Text>
                    <Text fontSize="sm" color="gray.500">
                      Último: {new Date(customer.lastOrder).toLocaleDateString()}
                    </Text>
                  </Td>
                  <Td fontWeight="medium">${customer.totalSpent.toLocaleString()}</Td>
                  <Td>
                    <CustomerStatusBadge status={customer.status} />
                  </Td>
                  <Td>
                    <Button size="sm" variant="ghost" leftIcon={<FiEye />}>
                      Ver
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  )
}
