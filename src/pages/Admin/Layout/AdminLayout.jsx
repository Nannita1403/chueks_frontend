import LogoutButton from "@/components/LogoutButton/LogoutButton";
import { Box, Flex, VStack, Button, Divider, Image } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminLayout = ({ logoSrc2 = "/logoChueks.png", children }) => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/admin", color: "purple.400" },
    { label: "Productos", path: "/admin/products", color: "cyan.400" },
    { label: "Categorías", path: "/admin/categories", color: "pink.400" },
    { label: "Analytics", path: "/admin/analytics", color: "yellow.400" },
    { label: "Pedidos", path: "/admin/orders", color: "green.400" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/auth");
  };

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        w="250px"
        bg="gray.900"
        color="white"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        py={6}
        px={4}
      >
        <VStack spacing={6} align="stretch">
          {/* Logo */}
          <Box textAlign="center" bgColor={"white"} borderRadius="md" p={2}>
            <Image src={logoSrc2} alt="Logo" mx="auto" mb={4} />
          </Box>

          {/* Menú de navegación */}
          <Box>
           {menuItems.map((item) => (
  <NavLink 
    key={item.path} 
    to={item.path} 
    end={item.path === "/admin"} // 👈 Solo Dashboard usa end
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
          </Box>
        </VStack>

        {/* Logout */}
        <Box mt={6}>
          <Divider mb={4} />
          <LogoutButton w="full" onClick={handleLogout}>
            Salir del Admin
          </LogoutButton>
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
