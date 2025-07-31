import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Container,
  useColorModeValue,
} from "@chakra-ui/react"
import { FiSearch, FiBell, FiUser } from "react-icons/fi"

export function AdminHeader({ title, description, actions }) {
  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")

  return (
    <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={10}>
      <Container maxW="full" px={6} py={4}>
        <Flex align="center" justify="space-between">
          <VStack spacing={1} align="start">
            <Heading size="lg">{title}</Heading>
            {description && (
              <Text color="gray.500" fontSize="sm">
                {description}
              </Text>
            )}
          </VStack>

          <HStack spacing={4}>
            <Box display={{ base: "none", md: "block" }}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray" />
                </InputLeftElement>
                <Input placeholder="Buscar..." w="64" />
              </InputGroup>
            </Box>

            <Box position="relative">
              <IconButton aria-label="Notifications" icon={<FiBell />} variant="ghost" />
              <Box position="absolute" top={0} right={0} w={2} h={2} bg="red.500" borderRadius="full" />
            </Box>

            <IconButton aria-label="Profile" icon={<FiUser />} variant="ghost" />

            {actions}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
