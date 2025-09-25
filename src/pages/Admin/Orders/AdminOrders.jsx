// src/pages/Admin/Orders/AdminOrders.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Box, Flex, Heading, Text, Button, Input, InputGroup, InputLeftElement,
  Tabs, TabList, TabPanels, Tab, TabPanel, Card, CardBody,
  Table, Thead, Tbody, Tr, Th, Td, Badge, useDisclosure,
} from "@chakra-ui/react";
import { FiSearch, FiEye, FiDownload } from "react-icons/fi";
import ApiService from "../../../reducers/api/Api.jsx";
import OrderDetailModal from "./OrderDetailModal.jsx";

/* ================= helpers ================= */
const money = (n = 0) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const TAB_TO_API = ["all", "pending", "processing", "completed"];
const STATUS_BADGE = {
  pending: { scheme: "yellow", label: "Pendiente" },
  processing: { scheme: "blue", label: "En proceso" },
  completed: { scheme: "green", label: "Completado" },
};

const OrderStatusBadge = ({ status }) => {
  const cfg = STATUS_BADGE[status] || { scheme: "gray", label: status || "—" };
  return <Badge colorScheme={cfg.scheme} variant="subtle">{cfg.label}</Badge>;
};

const codeOrId = (o) => o?.code || (o?._id ? `#${String(o._id).slice(-6).toUpperCase()}` : "—");
const when = (o) => new Date(o?.createdAt || o?.date || Date.now()).toLocaleString();

/* ================= page ================= */
export default function AdminOrders() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const modal = useDisclosure();

  const load = async () => {
    setLoading(true);
    try {
      const status = TAB_TO_API[tab];
      const resp = await ApiService.get(`/orders?status=${status}`);
      setOrders(resp?.orders || []);
    } catch (e) {
      console.error("No se pudieron cargar pedidos:", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(o => {
      const code = (o.code || "").toLowerCase();
      const name = (o.user?.name || "").toLowerCase();
      const email = (o.user?.email || "").toLowerCase();
      return code.includes(q) || name.includes(q) || email.includes(q);
    });
  }, [orders, search]);

  /* Mensaje común de estado */
  const StatusMessage = ({ text }) => (
    <Box p={4}><Text color="gray.500">{text}</Text></Box>
  );

  return (
    <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Pedidos</Heading>
          <Text color="gray.600">Gestiona y da seguimiento a los pedidos</Text>
        </Box>
        <Button leftIcon={<FiDownload />} variant="outline">Exportar</Button>
      </Flex>

      {/* Tabs por estado */}
      <Tabs index={tab} onChange={setTab} mb={4}>
        <TabList>
          <Tab>Todos</Tab>
          <Tab>Pendientes</Tab>
          <Tab>En Proceso</Tab>
          <Tab>Completados</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            {/* Search */}
            <Flex justify="space-between" align="center" mb={4} gap={4}>
              <InputGroup maxW="md">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar por ID o cliente…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Flex>

            <Card>
              <CardBody p={0}>
                {/* Desktop: tabla */}
                <Box display={{ base: "none", md: "block" }}>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Cliente</Th>
                        <Th>Fecha</Th>
                        <Th isNumeric>Total</Th>
                        <Th>Estado</Th>
                        <Th>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {!loading && filtered.map(o => (
                        <Tr key={o._id}>
                          <Td fontWeight="medium">{codeOrId(o)}</Td>
                          <Td>
                            <Box>
                              <Text fontWeight="medium">{o.user?.name || "—"}</Text>
                              <Text fontSize="sm" color="gray.500">{o.user?.email || ""}</Text>
                            </Box>
                          </Td>
                          <Td>{when(o)}</Td>
                          <Td isNumeric>{money(o.total || o.subtotal || 0)}</Td>
                          <Td><OrderStatusBadge status={o.status} /></Td>
                          <Td>
                            <Button
                              size="sm"
                              variant="ghost"
                              leftIcon={<FiEye />}
                              onClick={() => { setCurrent(o); modal.onOpen(); }}
                            >
                              Ver
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                      {loading && <Tr><Td colSpan={6}><StatusMessage text="Cargando…" /></Td></Tr>}
                      {!loading && filtered.length === 0 && <Tr><Td colSpan={6}><StatusMessage text="Sin resultados" /></Td></Tr>}
                    </Tbody>
                  </Table>
                </Box>

                {/* Mobile: cards */}
                <Box display={{ base: "flex", md: "none" }} flexDir="column" gap={4} p={4}>
                  {!loading && filtered.map(o => (
                    <Box key={o._id} borderWidth="1px" borderRadius="lg" p={4} shadow="sm">
                      <Text fontWeight="bold">{codeOrId(o)}</Text>
                      <Text>{o.user?.name || "—"}</Text>
                      <Text fontSize="sm" color="gray.500">{o.user?.email || ""}</Text>
                      <Text fontSize="sm">{when(o)}</Text>
                      <Text fontWeight="semibold">{money(o.total || o.subtotal || 0)}</Text>
                      <OrderStatusBadge status={o.status} />
                      <Button
                        size="sm"
                        mt={2}
                        leftIcon={<FiEye />}
                        onClick={() => { setCurrent(o); modal.onOpen(); }}
                      >
                        Ver
                      </Button>
                    </Box>
                  ))}
                  {loading && <StatusMessage text="Cargando…" />}
                  {!loading && filtered.length === 0 && <StatusMessage text="Sin resultados" />}
                </Box>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Tabs vacíos: reutilizamos el mismo panel mediante 'tab' */}
          <TabPanel p={0} />
          <TabPanel p={0} />
          <TabPanel p={0} />
        </TabPanels>
      </Tabs>

      {/* Modal de detalle */}
      <OrderDetailModal
        orderId={current?.code || current?._id}
        isOpen={modal.isOpen}
        onClose={() => { modal.onClose(); setCurrent(null); }}
        onUpdated={load}
      />
    </Box>
  );
}
