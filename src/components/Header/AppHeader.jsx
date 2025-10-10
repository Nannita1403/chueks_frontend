import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/Auth/auth.context.jsx";

export default function AppHeader({ logoSrc = "/logoRedondo.png", onOpenMenu }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const { cartItems, favorites } = useAuth();
  const cartCount = cartItems?.length || 0;
  const wishlistCount = favorites?.length || 0;

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={50}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Container maxW="container.xl" py={3}>
        <Flex align="center" justify="space-between">
          <HStack spacing={4}>
            <IconButton
              aria-label="Menu"
              icon={<FiMenu />}
              variant="ghost"
              display={{ base: "inline-flex", md: "none" }}
              onClick={onOpenMenu}
            />
            <Link to="/home">
              <Image src={logoSrc} alt="Logo" height={35} />
            </Link>
          </HStack>

          <Box
            flex={1}
            maxW="md"
            mx={4}
            display={{ base: "none", md: "block" }}
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray" />
              </InputLeftElement>
              <Input type="search" placeholder="Buscar productos..." />
            </InputGroup>
          </Box>

          <HStack spacing={2}>
            <Link to="/wishlist">
              <Box position="relative">
                <IconButton
                  aria-label="Wishlist"
                  icon={<FiHeart />}
                  variant="ghost"
                />
                {wishlistCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme="pink"
                    borderRadius="full"
                    fontSize="xs"
                    minW={5}
                    h={5}
                    display="grid"
                    placeItems="center"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Box>
            </Link>

            <Link to="/cart">
              <Box position="relative">
                <IconButton
                  aria-label="Cart"
                  icon={<FiShoppingBag />}
                  variant="ghost"
                />
                {cartCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme="pink"
                    borderRadius="full"
                    fontSize="xs"
                    minW={5}
                    h={5}
                    display="grid"
                    placeItems="center"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Box>
            </Link>

            <Link to="/profile">
              <IconButton aria-label="Profile" icon={<FiUser />} variant="ghost" />
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
