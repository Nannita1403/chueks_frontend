import { Box, Flex, VStack, Button, Text, Divider } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Productos", path: "/admin/products" },
    { label: "Categorías", path: "/admin/categories" },
    { label: "Analytics", path: "/admin/analytics" },
    { label: "Pedidos", path: "/admin/orders" },
  ];

  const handleLogout = () => {
    // Limpiar auth y redirigir
    localStorage.removeItem("authToken"); // ejemplo
    navigate("/login");
  };

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        w="250px"
        bg="gray.800"
        color="white"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        py={6}
        px={4}
      >
        <VStack spacing={6} align="stretch">
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>
              MiLogo
            </Text>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: "block",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: isActive ? "#ED64A6" : "transparent",
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </Box>
        </VStack>
        <Box mt={6}>
          <Divider mb={4} />
          <Button colorScheme="red" w="full" onClick={handleLogout}>
            Salir del Admin
          </Button>
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
