import LogoutButton from "@/components/LogoutButton/LogoutButton";
import { Box, Flex, VStack, Divider, Image, Spacer } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const AdminLayout = ({ logoSrc2 = "/logoChueks.png", children }) => {
  const menuItems = [
    { label: "Dashboard", path: "/admin", color: "purple.400" },
    { label: "Productos", path: "/admin/products", color: "cyan.400" },
    { label: "Categorías", path: "/admin/categories", color: "pink.400" },
    { label: "Analytics", path: "/admin/analytics", color: "yellow.400" },
    { label: "Pedidos", path: "/admin/orders", color: "green.400" },
  ];

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        w="250px"
        bg="gray.900"
        color="white"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        py={6}
        px={4}
      >
        {/* Logo */}
        <Box textAlign="center" bgColor="white" borderRadius="md" p={2} mb={6}>
          <Image src={logoSrc2} alt="Logo" mx="auto" />
        </Box>

        {/* Menú de navegación centrado */}
        <VStack spacing={4} flex="1" justify="center" align="stretch">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <Box
                  px={4}
                  py={2}
                  borderRadius="md"
                  fontWeight={isActive ? "bold" : "normal"}
                  bg={isActive ? item.color : "transparent"}
                  color={isActive ? "white" : "gray.200"}
                  _hover={{
                    bg: isActive ? item.color : `${item.color}`,
                    color: "white",
                  }}
                  transition="all 0.2s"
                >
                  {item.label}
                </Box>
              )}
            </NavLink>
          ))}
        </VStack>

        {/* Botón de salir, separado del menú */}
        <Box mt={8}>
          <Divider mb={4} />
          <LogoutButton w="full">Salir del Admin</LogoutButton>
        </Box>
      </Box>

      {/* Main content */}
      <Box flex="1" bg="gray.50" p={6}>
        {children}
      </Box>
    </Flex>
  );
};

export default AdminLayout;
