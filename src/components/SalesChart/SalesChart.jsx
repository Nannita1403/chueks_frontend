import { useState, useEffect } from "react"
import { Box, Text } from "@chakra-ui/react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const salesData = {
  "7d": [
    { name: "Lun", sales: 120000 },
    { name: "Mar", sales: 145000 },
    { name: "Mié", sales: 132000 },
    { name: "Jue", sales: 178000 },
    { name: "Vie", sales: 189000 },
    { name: "Sáb", sales: 210000 },
    { name: "Dom", sales: 165000 },
  ],
  "30d": [
    { name: "Sem 1", sales: 850000 },
    { name: "Sem 2", sales: 920000 },
    { name: "Sem 3", sales: 880000 },
    { name: "Sem 4", sales: 1050000 },
  ],
  "90d": [
    { name: "Ene", sales: 2800000 },
    { name: "Feb", sales: 3100000 },
    { name: "Mar", sales: 2950000 },
  ],
}

export function SalesChart({ timeRange }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <Box h="320px" display="flex" alignItems="center" justifyContent="center">
        <Text>Cargando gráfico...</Text>
      </Box>
    )
  }

  return (
    <Box h="320px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={salesData[timeRange]}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${value / 1000}k`} width={80} />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]}
            labelFormatter={(label) => `Día: ${label}`}
          />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}
