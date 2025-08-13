import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logoRedondo from "/logoRedondo.png"
import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  Button,
  Image,
  useToast,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  HStack,
  Flex,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react"

export default function AuthPg() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Inicio de sesión exitoso",
        status: "success",
        duration: 2000,
      })
      navigate("/dashboard")
    }, 1000)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate register
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Registro exitoso",
        status: "success",
        duration: 2000,
      })
      navigate("/dashboard")
    }, 1000)
  }

  const bgColor = useColorModeValue("white", "gray.800")

  return (
    <Flex minH="100vh" bg={bgColor} wrap={"wrap"}>
    {/* Form Section */}
    <Flex w={{ base: "100%", md: "50%" }} align="center" justify="center" p={8}>
      <Container maxW="md">
        <VStack spacing={8}>
          <VStack spacing={4}>
            <Image src={logoRedondo} alt="Logo de la marca"h="60px" />
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Bienvenido a Chueks
            </Text>
          </VStack>

          <Card w="full">
            <CardBody>
              <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab color={"pink.500"}>Iniciar Sesión</Tab>
                  <Tab color={"cyan.500"}>Registrarse</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <form onSubmit={handleLogin}>
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input type="email" required />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Contraseña</FormLabel>
                          <Input type="password" required />
                        </FormControl>
                        <Button type="submit" colorScheme="primary" size="lg" w="full" isLoading={isLoading}>
                          Iniciar Sesión
                        </Button>
                      </VStack>
                    </form>
                  </TabPanel>
                  <TabPanel>
                    <form onSubmit={handleRegister}>
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel>Nombre</FormLabel>
                          <Input type="text" required />
                        </FormControl>
                         <FormControl>
                          <FormLabel>Telefono</FormLabel>
                          <Input type="telephone" required />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input type="email" required />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Contraseña</FormLabel>
                          <Input type="password" required />
                        </FormControl>
                        <Button type="submit" colorScheme="primary" size="lg" w="full" isLoading={isLoading}>
                          Registrarse
                        </Button>
                      </VStack>
                    </form>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Flex>
    {/* Description Section */}
    <Flex w={{ base: "100%", md: "50%" }} bg="black" color="white" p={8} align="center" justify="center">
        <Box maxW="md">
          <VStack spacing={6} align="start">
            <Heading size="lg" color="white">
              Catálogo Exclusivo de Accesorios y Carteras
            </Heading>

            <VStack spacing={4} align="start">
              <Text color="gray.300">
                Bienvenido a CHUEKS, tu destino para accesorios y carteras de diseño exclusivo para venta mayorista.
              </Text>

              <VStack spacing={2} align="start">
                <HStack>
                  <Box w={4} h={4} borderRadius="full" bg="pink.500" />
                  <Heading size="sm" color="white">
                    Diseños Exclusivos
                  </Heading>
                </HStack>
                <Text color="gray.300" pl={6}>
                  Accede a nuestra colección de productos únicos y de alta calidad.
                </Text>
              </VStack>

              <VStack spacing={2} align="start">
                <HStack>
                  <Box w={4} h={4} borderRadius="full" bg="cyan.500" />
                  <Heading size="sm" color="white">
                    Información Detallada
                  </Heading>
                </HStack>
                <Text color="gray.300" pl={6}>
                  Consulta precios, colores, categorías y materiales de confección.
                </Text>
              </VStack>

              <VStack spacing={2} align="start">
                <HStack>
                  <Box w={4} h={4} borderRadius="full" bg="yellow.400" />
                  <Heading size="sm" color="white">
                    Listas Personalizadas
                  </Heading>
                </HStack>
                <Text color="gray.300" pl={6}>
                  Guarda tus favoritos y crea listas de compra para enviar al administrador.
                </Text>
              </VStack>
            </VStack>

            <Box pt={4}>
              <Text fontSize="sm" color="gray.400" fontStyle="italic">
                "Eleva tu negocio con nuestros productos exclusivos y de alta calidad."
              </Text>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Flex>


  )
}
