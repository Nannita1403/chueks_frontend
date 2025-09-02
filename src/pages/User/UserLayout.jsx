// src/layouts/UserLayout.jsx
import {
  Box,
  Flex,
  VStack,
  Button,
  Text,
  Divider,
  Image,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import AddressModal from "../../components/Profile/AdressesModal.jsx";
import PhoneModal from "../../components/Profile/PhoneModal.jsx";

const menuItems = [
  { label: "Mis datos", path: "/profile", color: "purple.400", type: "link" },
  { label: "Pedidos", path: "/profile/orders", color: "cyan.400", type: "link" },
  { label: "Direcciones", path: "/profile/addresses", color: "pink.400", type: "modal" },
  { label: "Teléfonos", path: "/profile/phones", color: "yellow.400", type: "modal" },
];

const SidebarContent = ({
  onClose,
  onOpenAddresses,
  onOpenPhones,
  logoSrc,
  handleLogout,
  handleClick,
  location,
  navigate,
}) => (
  <Flex
    direction="column"
    h="100%"
    justify="space-between"
    bg="gray.900"
    color="white"
    p={4}
    w="250px"
  >
    <VStack spacing={6} align="stretch">
      {/* Logo */}
      <Box textAlign="center" bg="white" borderRadius="md" p={2}>
        <Image src={logoSrc} alt="Logo" mx="auto" mb={2} maxH="60px" />
        <Text fontWeight="bold" fontSize="lg" color="gray.900">
          Mi Perfil
        </Text>
      </Box>

      {/* Volver al Home */}
      <Button
        bg="white"
        color="gray.800"
        w="full"
        mb={4}
        _hover={{ bg: "gray.200" }}
        onClick={() => {
          navigate("/");
          onClose?.();
        }}
      >
        Volver al Home
      </Button>

      {/* Menú */}
      <Box>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.path}
              justifyContent="flex-start"
              w="full"
              mb={2}
              bg={isActive ? item.color : "white"}
              color={isActive ? "white" : "gray.900"}
              fontWeight={isActive ? "bold" : "normal"}
              borderRadius="md"
              onClick={() => {
                handleClick(item);
                onClose?.();
              }}
              _hover={{
                bg: item.color,
                color: "white",
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>
    </VStack>

    {/* Botón salir */}
    <Box mt={6}>
      <Divider mb={4} />
      <Button
        bg="red.500"
        color="white"
        w="full"
        _hover={{ bg: "red.600" }}
        onClick={() => {
          handleLogout();
          onClose?.();
        }}
      >
        Salir
      </Button>
    </Box>
  </Flex>
);

const UserLayout = ({ logoSrc = "/logoChueks.png" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ✅ Modals
  const {
    isOpen: isAddressesOpen,
    onOpen: onOpenAddresses,
    onClose: onCloseAddresses,
  } = useDisclosure();

  const {
    isOpen: isPhonesOpen,
    onOpen: onOpenPhones,
    onClose: onClosePhones,
  } = useDisclosure();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleClick = (item) => {
    if (item.type === "modal") {
      if (item.label === "Direcciones") onOpenAddresses();
      if (item.label === "Teléfonos") onOpenPhones();
    } else {
      navigate(item.path);
    }
  };

  return (
    <Flex minH="100vh">
      {/* Sidebar fijo en desktop */}
      <Box display={{ base: "none", md: "block" }} position="fixed" h="100vh">
        <SidebarContent
          logoSrc={logoSrc}
          handleLogout={handleLogout}
          handleClick={handleClick}
          location={location}
          navigate={navigate}
          onOpenAddresses={onOpenAddresses}
          onOpenPhones={onOpenPhones}
        />
      </Box>

      {/* Botón hamburguesa en mobile */}
      <IconButton
        aria-label="Abrir menú"
        icon={<HamburgerIcon />}
        display={{ base: "block", md: "none" }}
        position="fixed"
        top={4}
        left={4}
        zIndex={1000}
        onClick={onOpen}
      />

      {/* Drawer en mobile */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg="gray.900" color="white">Menú</DrawerHeader>
          <DrawerBody p={0}>
            <SidebarContent
              onClose={onClose}
              logoSrc={logoSrc}
              handleLogout={handleLogout}
              handleClick={handleClick}
              location={location}
              navigate={navigate}
              onOpenAddresses={onOpenAddresses}
              onOpenPhones={onOpenPhones}
            />
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>

      {/* Main content con Outlet */}
      <Box
        flex="1"
        p={6}
        ml={{ base: 0, md: "250px" }}
        bg={useColorModeValue("gray.50", "gray.900")}
      >
        <Outlet />
      </Box>

      {/* ✅ Modals */}
      <AddressModal isOpen={isAddressesOpen} onClose={onCloseAddresses} />
      <PhoneModal isOpen={isPhonesOpen} onClose={onClosePhones} />
    </Flex>
  );
};

export default UserLayout;
