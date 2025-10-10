import { useState } from "react"
import { Box, Card, CardBody, CardHeader, Heading, Text, Tabs, TabList, TabPanels,
  Tab, TabPanel, Select, Grid, Flex, Stat, StatNumber, StatHelpText, StatArrow,
} from "@chakra-ui/react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend } from "recharts"

const productAnalytics = {
  mostViewed: [
    { name: "Cartera Milano", value: 1245 },
    { name: "Mochila Urban", value: 980 },
    { name: "Bolso Weekend", value: 865 },
    { name: "Riñonera Sport", value: 720 },
    { name: "Cartera Mini", value: 650 },
  ],
  mostWishlisted: [
    { name: "Cartera Milano", value: 320 },
    { name: "Mochila Urban", value: 285 },
    { name: "Cartera Mini", value: 240 },
    { name: "Bolso Weekend", value: 210 },
    { name: "Riñonera Sport", value: 185 },
  ],
  mostPurchased: [
    { name: "Cartera Milano", value: 148 },
    { name: "Mochila Urban", value: 132 },
    { name: "Bolso Weekend", value: 115 },
    { name: "Riñonera Sport", value: 98 },
    { name: "Cartera Mini", value: 87 },
  ],
  priceRanges: [
    { name: "Menos de $10.000", value: 25 },
    { name: "$10.000 - $15.000", value: 40 },
    { name: "$15.000 - $20.000", value: 20 },
    { name: "Más de $20.000", value: 15 },
  ],
  popularStyles: [
    { name: "Elegante", value: 35 },
    { name: "Casual", value: 30 },
    { name: "Deportivo", value: 15 },
    { name: "Formal", value: 12 },
    { name: "Moderno", value: 8 },
  ],
  popularColors: [
    { name: "Negro", value: 40 },
    { name: "Marrón", value: 25 },
    { name: "Beige", value: 15 },
    { name: "Azul", value: 10 },
    { name: "Rojo", value: 10 },
  ],
  categoryPerformance: [
    { name: "Carteras", ventas: 320, ingresos: 3840000 },
    { name: "Mochilas", ventas: 280, ingresos: 4480000 },
    { name: "Bolsos", ventas: 210, ingresos: 3885000 },
    { name: "Riñoneras", ventas: 180, ingresos: 1602000 },
    { name: "Accesorios", ventas: 150, ingresos: 1050000 },
  ],
}

const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Análisis de Productos</Heading>
          <Text color="gray.600">Estadísticas y métricas de rendimiento de productos</Text>
        </Box>
        <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} w="180px">
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
          <option value="year">Último año</option>
        </Select>
      </Flex>

      <Tabs>
        <TabList>
          <Tab>Popularidad</Tab>
          <Tab>Preferencias</Tab>
          <Tab>Rendimiento</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Grid templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(250px, 1fr))" }} gap={4}>
              <Card>
                <CardHeader>
                  <Heading size="md">Productos Más Vistos</Heading>
                  <Text color="gray.600">Los productos con más visitas</Text>
                </CardHeader>
                <CardBody>
                  <Box h="320px">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productAnalytics.mostViewed} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" name="Vistas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md">Más Guardados</Heading>
                  <Text color="gray.600">Los productos más añadidos a favoritos</Text>
                </CardHeader>
                <CardBody>
                    <Box h={{ base: "250px", md: "320px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productAnalytics.mostWishlisted} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" name="Guardados" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md">Más Comprados</Heading>
                  <Text color="gray.600">Los productos con más ventas</Text>
                </CardHeader>
                <CardBody>
                  <Box h="320px">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productAnalytics.mostPurchased} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#ffc658" name="Ventas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
              <Card>
                <CardHeader>
                  <Heading size="md">Rangos de Precio</Heading>
                  <Text color="gray.600">Distribución de ventas por rango de precio</Text>
                </CardHeader>
                <CardBody>
                  <Box h="320px">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productAnalytics.priceRanges}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {productAnalytics.priceRanges.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md">Estilos Populares</Heading>
                  <Text color="gray.600">Distribución de ventas por estilo</Text>
                </CardHeader>
                <CardBody>
                  <Box h="320px">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productAnalytics.popularStyles}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {productAnalytics.popularStyles.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md">Colores Populares</Heading>
                  <Text color="gray.600">Distribución de ventas por color</Text>
                </CardHeader>
                <CardBody>
                  <Box h="320px">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productAnalytics.popularColors}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {productAnalytics.popularColors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Card mb={6}>
              <CardHeader>
                <Heading size="md">Rendimiento por Categoría</Heading>
                <Text color="gray.600">Ventas e ingresos por categoría de producto</Text>
              </CardHeader>
              <CardBody>
                <Box h="400px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productAnalytics.categoryPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "ingresos") return [`$${value.toLocaleString()}`, "Ingresos"]
                          return [value, "Ventas"]
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="ventas" fill="#8884d8" name="Ventas (unidades)" />
                      <Bar yAxisId="right" dataKey="ingresos" fill="#82ca9d" name="Ingresos ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>

            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
              <Card>
                <CardHeader>
                  <Heading size="md">Tasa de Conversión</Heading>
                  <Text color="gray.600">Porcentaje de visitas que resultan en compras</Text>
                </CardHeader>
                <CardBody>
                  <Stat textAlign="center">
                    <StatNumber fontSize="5xl">8.2%</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      1.5% vs mes anterior
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md">Valor Promedio de Pedido</Heading>
                  <Text color="gray.600">Valor promedio por pedido</Text>
                </CardHeader>
                <CardBody>
                  <Stat textAlign="center">
                    <StatNumber fontSize="5xl">$42,500</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      3.2% vs mes anterior
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
