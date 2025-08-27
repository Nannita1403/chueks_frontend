

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { Box, Flex, VStack, Image, Text, IconButton, useColorModeValue } from "@chakra-ui/react"
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiTag,
  FiSettings,
  FiBarChart3,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const navigate = useNavigate();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: FiHome,
    },
    {
      title: "Productos",
      href: "/admin/products",
      icon: FiPackage,
    },
    {
      title: "Categorías",
      href: "/admin/categories",
      icon: FiTag,
    },
    {
      title: "Pedidos",
      href: "/admin/orders",
      icon: FiShoppingCart,
    },
    {
      title: "Clientes",
      href: "/admin/customers",
      icon: FiUsers,
    },
    {
      title: "Análisis",
      href: "/admin/analytics",
      icon: FiBarChart3,
    },
    {
      title: "Configuración",
      href: "/admin/settings",
      icon: FiSettings,
    },
  ]

  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      w={collapsed ? "16" : "64"}
      h="100vh"
      position="sticky"
      top={0}
      transition="width 0.3s"
      display="flex"
      flexDirection="column"
    >
      <Flex p={4} borderBottom="1px" borderColor={borderColor} align="center" justify="space-between">
        {!collapsed && (
          <Link to="/admin">
            <Image src="/logo-chueks.png" alt="CHUEKS Logo" width={120} height={40} />
          </Link>
        )}
        {collapsed && (
          <Link to="/admin">
             <Image src="/logo-redondo.png" alt="CHUEKS Logo" width={32} height={32} />
          </Link>
          
          //<Link href="/admin">
          //  <Image src="/logo-redondo.png" alt="CHUEKS Logo" width={32} height={32} />
          //</Link>
        )}
        <IconButton
          aria-label="Toggle sidebar"
          icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          ml="auto"
        />
      </Flex>

      <Box flex={1} py={4} overflowY="auto">
        <VStack spacing={1} px={2}>
          {navItems.map((item) => {
            const IconComponent = item.icon
            const isActive = navigate === item.href

            return (
              <Link key={item.href} top={item.href} style={{ width: "100%" }}>
                <Flex
                  align="center"
                  px={3}
                  py={2}
                  borderRadius="md"
                  bg={isActive ? "gray.100" : "transparent"}
                  color={isActive ? "gray.900" : "gray.600"}
                  _hover={{ bg: "gray.50", color: "gray.900" }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  <IconComponent />
                  {!collapsed && (
                    <Text ml={3} fontSize="sm" fontWeight="medium">
                      {item.title}
                    </Text>
                  )}
                </Flex>
              </Link>
            )
          })}
        </VStack>
      </Box>

      <Box p={4} borderTop="1px" borderColor={borderColor}>
        <Link to="/home" style={{ width: "100%" }}>
          <Flex
            align="center"
            px={3}
            py={2}
            borderRadius="md"
            color="gray.600"
            _hover={{ bg: "gray.50", color: "gray.900" }}
            transition="all 0.2s"
            cursor="pointer"
          >
            <FiLogOut />
            {!collapsed && (
              <Text ml={3} fontSize="sm" fontWeight="medium">
                Salir del Admin
              </Text>
            )}
          </Flex>
        </Link>
      </Box>
    </Box>
  )
}
