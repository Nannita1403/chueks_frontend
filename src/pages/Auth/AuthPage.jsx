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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react"
import Loading from "../../components/Loading/Loading.jsx"
import { useAuth } from "../../context/Auth/auth.context.jsx"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    telephone: "",
  })
  const [verificationError, setVerificationError] = useState(null)
  const navigate = useNavigate()
  const toast = useToast()
  const { login, register } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setVerificationError(null)

    const formData = new FormData(e.target)
    const email = formData.get("email") || loginData.email
    const password = formData.get("password") || loginData.password

    const credentials = { email, password }

    try {
      console.log("🔐 Intentando login con:", {
        email: credentials.email,
        password: credentials.password,
        passwordLength: credentials.password.length,
      })
      console.log("📤 Datos exactos enviados:", JSON.stringify(credentials))

      const result = await login(credentials)
      console.log("✅ Login exitoso:", result)

      toast({
        title: "Inicio de sesión exitoso",
        status: "success",
        duration: 2000,
      })

      setTimeout(() => {
        if (result.user && result.user.rol === "admin") {
          console.log("🔄 Redirecting admin to /admin")
          navigate("/admin", { replace: true })
        } else {
          console.log("🔄 Redirecting user to /home")
          navigate("/home", { replace: true })
        }
      }, 100)
    } catch (error) {
      console.error("❌ Error en login:", error)
      
      if (error.isVerificationError) {
        setVerificationError({
          email: credentials.email,
          message: error.message,
        })
        toast({
          title: "Verificación requerida",
          description: error.message,
          status: "warning",
          duration: 5000,
        })
      } else {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Credenciales incorrectas",
        status: "error",
        duration: 3000,
      })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target)
    const name = formData.get("name") || registerData.name
    const email = formData.get("email") || registerData.email
    const password = formData.get("password") || registerData.password
    const telephone = formData.get("telephone") || registerData.telephone

    const registrationData = { name, email, password, telephone }

    try {
      console.log("📝 Intentando registro con:", registrationData)
      console.log("📤 Datos exactos enviados:", JSON.stringify(registrationData))

      const result = await register(registrationData)
      console.log("✅ Registro exitoso:", result)

      toast({
        title: "Registro exitoso",
        description: "Por favor verifica tu email",
        status: "success",
        duration: 3000,
      })

      navigate("/home")
    } catch (error) {
      console.error("❌ Error en registro:", error)
      toast({
        title: "Error al registrarse",
        description: error.message || "Error en el registro",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }
  const bgColor = useColorModeValue("white", "gray.800")

  return (
        <Flex minH="100vh" bg={bgColor}>
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
          
          {verificationError && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>¡Verificación requerida!</AlertTitle>
                <AlertDescription>
                  {verificationError.message}
                  <br />
                  <Text fontSize="sm" mt={2}>
                    Revisa tu email <strong>{verificationError.email}</strong> y haz clic en el enlace de verificación.
                  </Text>
                </AlertDescription>
              </Box>
            </Alert>
          )}

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
                          <Input name="email" type="email" required />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Contraseña</FormLabel>
                          <Input name="password" type="password" required />
                        </FormControl>
                        <Button type="submit" colorScheme="primary" size="lg" w="full">
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
                          <Input name="name" type="text" required />
                        </FormControl>
                         <FormControl>
                          <FormLabel>Telefono</FormLabel>
                          <Input name="telephone" type="telephone" required />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input name="email" type="email" required />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Contraseña</FormLabel>
                          <Input name="password" type="password" required />
                        </FormControl>
                        <Button type="submit" colorScheme="primary" size="lg" w="full">
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
