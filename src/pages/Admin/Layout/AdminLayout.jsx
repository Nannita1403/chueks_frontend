import LogoutButton from "../../../components/LogoutButton/LogoutButton.jsx";
import {
  Box,
  Flex,
  VStack,
  Divider,
  Image,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const AdminLayout = ({ logoSrc2 = "/logoChueks.png" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const menuItems = [
    { label: "Dashboard", path: "/admin", color: "purple.400" },
    { label: "Productos", path: "/admin/products", color: "cyan.400" },
    { label: "Categorías", path: "/admin/categories", color: "pink.400" },
    { label: "Analytics", path: "/admin/analytics", color: "yellow.400" },
    { label: "Pedidos", path: "/admin/orders", color: "green.400" },
  ];

  const bgColor = useColorModeValue("gray.50", "gray.800");

  const MenuContent = (
    <VStack spacing={4} flex="1" justify="center" align="stretch" px={4}>
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
              py={3}
              borderRadius="md"
              fontSize="md"
              fontWeight={isActive ? "bold" : "medium"}
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
  );

  return (
    <Flex h="100vh" bg={bgColor}>
      {/* Sidebar Desktop */}
      <Box
        w="280px"
        bg="gray.900"
        color="white"
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        py={6}
        px={4}
      >
        <Box textAlign="center" bgColor="white" borderRadius="md" p={2} mb={8}>
          <Image src={logoSrc2} alt="Logo" mx="auto" />
        </Box>

        {MenuContent}

        <Box mt={8}>
          <Divider mb={4} />
          <LogoutButton w="full">Salir</LogoutButton>
        </Box>
      </Box>

      {/* Sidebar Mobile */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.900" color="white">
          <DrawerCloseButton mt={2} />
          <DrawerBody mt={8}>
            <Box textAlign="center" bgColor="white" borderRadius="md" p={2} mb={8}>
              <Image src={logoSrc2} alt="Logo" mx="auto" />
            </Box>

            {MenuContent}

            <Box mt={8}>
              <Divider mb={4} />
              <LogoutButton w="full">Salir</LogoutButton>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Contenido */}
      <Flex flex="1" direction="column">
        {/* Top bar para móviles */}
        <Flex
          display={{ base: "flex", md: "none" }}
          bg="gray.900"
          color="white"
          p={2}
          align="center"
        >
          <IconButton
            icon={<FiMenu />}
            aria-label="Abrir menú"
            onClick={onOpen}
            variant="outline"
            mr={2}
          />
          <Image src={logoSrc2} alt="Logo" h={8} />
        </Flex>

        <Box flex="1" p={8} maxW="1200px" mx="auto" overflowY="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminLayout;
