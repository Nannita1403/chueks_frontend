export function OrderList({ orders, loading, search, setSearch, onOpenModal }) {
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

  const StatusMessage = ({ text }) => (
    <Box p={4}><Text color="gray.500">{text}</Text></Box>
  );

  return (
    <>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none"><FiSearch color="gray" /></InputLeftElement>
        <Input
          placeholder="Buscar por ID o cliente…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <Card>
        <CardBody p={0}>
          {/* Versión desktop */}
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
                        onClick={() => onOpenModal(o)}
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

          {/* Versión móvil */}
          <Box display={{ base: "flex", md: "none" }} flexDir="column" gap={3}>
            {!loading && filtered.map(o => (
              <Card key={o._id} size="sm" p={3} shadow="sm">
                <Text fontWeight="bold">{codeOrId(o)}</Text>
                <Text>{o.user?.name || "—"}</Text>
                <Text fontSize="sm" color="gray.500">{o.user?.email || ""}</Text>
                <Text fontSize="sm">{when(o)}</Text>
                <Text fontWeight="semibold">{money(o.total || o.subtotal || 0)}</Text>
                <OrderStatusBadge status={o.status} />
                <Button size="sm" mt={2} leftIcon={<FiEye />} onClick={() => onOpenModal(o)}>
                  Ver
                </Button>
              </Card>
            ))}
            {loading && <StatusMessage text="Cargando…" />}
            {!loading && filtered.length === 0 && <StatusMessage text="Sin resultados" />}
          </Box>
        </CardBody>
      </Card>
    </>
  );
}
