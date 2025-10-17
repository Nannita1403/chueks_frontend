import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoRedondo from "/logoRedondo.png";
import { Box, Container, VStack, Text, Input, Button, Image, FormControl, FormLabel, Tabs, TabList, TabPanels,
  Tab, TabPanel, Card, CardBody, HStack, Flex, useColorModeValue, Heading, Alert, AlertIcon, AlertTitle,
  AlertDescription, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  FormErrorMessage,} from "@chakra-ui/react";
import Loading from "../../components/Loading/Loading.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import { useToast } from "../../Hooks/useToast.jsx";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, registerUser } = useAuth();

  const parseAuthError = (error) => {
    if (!error) return "Error desconocido. Intenta nuevamente.";

    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) return data.message || "Datos inválidos. Revisa el formulario.";
      if (status === 401) return "Email o contraseña incorrectos.";
      if (status === 403) return "Tu cuenta no tiene permisos para acceder.";
      if (status === 409) return "El correo ya está registrado. Inicia sesión.";
      if (status === 500) return "Error interno del servidor. Intenta más tarde.";

      return data?.message || "Ocurrió un error inesperado en el servidor.";
    }

    if (error.code === "ERR_NETWORK")
      return "No se pudo conectar con el servidor. Revisa tu conexión a Internet.";

    return error.message || "Error inesperado. Intenta nuevamente.";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setVerificationError(null);
    setLoginErrors({});

    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      const result = await login(credentials);

      toast({
        title: "Inicio de sesión exitoso",
        status: "success",
        duration: 2000,
      });

      setTimeout(() => {
        if (result.user?.rol === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }, 100);
    } catch (error) {
    console.error("❌ Error en login:", error.message);
    if (error.response?.data?.errors) {
      console.group("🔴 Errores en Login", "color:red; font-weight:bold;");
      console.error("Detalles:", error.response.data.errors);
      console.groupEnd();

      setLoginErrors(error.response.data.errors);

      Object.keys(error.response.data.errors).forEach((key) => {
            toast({
              title: `Error en el campo: ${key}`,
              description: error.response.data.errors[key],
              status: "error",
              duration: 4000,
            });
          });
        } else {
          toast({
            title: "Error al iniciar sesión",
            description: parseAuthError(error),
            status: "error",
            duration: 4000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

 const handleRegister = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setRegisterErrors({});

  const formData = new FormData(e.target);
  const registrationData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    telephone: formData.get("telephone"),
  };

  try {
    await registerUser(registrationData);

    toast({
      title: "Registro exitoso",
      description:
        "Revisa tu correo para verificar tu cuenta antes de iniciar sesión.",
      status: "success",
      duration: 5000,
    });

    navigate("/auth", { replace: true });
  } catch (error) {
    console.group("🔴 Error en registro", "color:red; font-weight:bold;");
    console.error("Mensaje:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("Objeto completo:", error);
    console.groupEnd();

    if (error.response?.data?.errors) {
      console.group("Errores del servidor", "color:red;");
      Object.entries(error.response.data.errors).forEach(([field, message]) => {
        console.error(`Campo: ${field} - Error: ${message}`);
      });
      console.groupEnd();
      sObject.keys(error.response.data.errors).forEach((key) => {
        toast({
          title: `Error en el campo: ${key}`,
          description: error.response.data.errors[key],
          status: "error",
          duration: 4000,
        });
      });
      setRegisterErrors(error.response.data.errors);
        } else {
          toast({
            title: "Error al registrarse",
            description: parseAuthError(error),
            status: "error",
            duration: 4000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

      
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get("verified");
    if (verified === "1") {
      toast({
        title: "✅ Cuenta verificada",
        description: "Gracias por verificar tu correo. Ya puedes iniciar sesión.",
        status: "success",
      });
    } else if (verified === "0") {
      toast({
        title: "❌ Error en la verificación",
        description:
          "Hubo un problema al verificar tu cuenta. Intenta nuevamente.",
        status: "error",
      });
    }
  }, [location, toast]);
  if (isLoading) {
    return <Loading />;
  }

  const bgColor = useColorModeValue("white", "gray.800");

  const descriptionBlock = (
    <Box maxW="md">
      <VStack spacing={6} align="start">
        <Heading size="lg" color="white">
          Catálogo Exclusivo de Accesorios y Carteras
        </Heading>

        <VStack spacing={4} align="start">
          <Text color="gray.300">
            Bienvenido a CHUEKS, tu destino para accesorios y carteras de
            diseño exclusivo para venta mayorista.
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
              Guarda tus favoritos y crea listas de compra para enviar al
              administrador.
            </Text>
          </VStack>
        </VStack>

        <Box pt={4}>
          <Text fontSize="sm" color="gray.400" fontStyle="italic">
            "Eleva tu negocio con nuestros productos exclusivos y de alta
            calidad."
          </Text>
        </Box>
      </VStack>
    </Box>
  );

  return (
    <Flex minH="100vh" bg={bgColor} flexDir={{ base: "column", md: "row" }}>
      <Flex
        w={{ base: "100%", md: "50%" }}
        align="center"
        justify="center"
        p={8}
        bg={bgColor}
      >
        <Container maxW="md">
          <VStack spacing={8}>
            <VStack spacing={4}>
              <Image src={logoRedondo} alt="Logo de la marca" h="60px" />
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
                      Revisa tu email <strong>{verificationError.email}</strong>{" "}
                      y haz clic en el enlace de verificación.
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
                          <FormControl isInvalid={!!loginErrors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input name="email" type="email" required />
                            <FormErrorMessage>{loginErrors.email}</FormErrorMessage>
                          </FormControl>
                          <FormControl isInvalid={!!loginErrors.password}>
                            <FormLabel>Contraseña</FormLabel>
                            <Input name="password" type="password" required />
                            <FormErrorMessage>{loginErrors.password}</FormErrorMessage>
                          </FormControl>
                          <Button
                            type="submit"
                            colorScheme="pink"
                            size="lg"
                            w="full"
                          >
                            Iniciar Sesión
                          </Button>
                        </VStack>
                      </form>
                    </TabPanel>
                    <TabPanel>
                      <form onSubmit={handleRegister}>
                        <VStack spacing={4}>
                        <FormControl isInvalid={!!registerErrors.name}>
                          <FormLabel>Nombre</FormLabel>
                          <Input name="name" type="text" required />
                          <FormErrorMessage>{registerErrors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!registerErrors.telephone}>
                          <FormLabel>Telefono</FormLabel>
                          <Input name="telephone" type="tel" required />
                          <FormErrorMessage>{registerErrors.telephone}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!registerErrors.email}>
                          <FormLabel>Email</FormLabel>
                          <Input name="email" type="email" required />
                          <FormErrorMessage>{registerErrors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!registerErrors.password}>
                          <FormLabel>Contraseña</FormLabel>
                          <Input name="password" type="password" required />
                          <FormErrorMessage>{registerErrors.password}</FormErrorMessage>
                        </FormControl>
                          <Button
                            type="submit"
                            colorScheme="cyan"
                            size="lg"
                            w="full"
                          >
                            Registrarse
                          </Button>
                        </VStack>
                      </form>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>

            <Box w="full" display={{ base: "block", md: "none" }}>
              <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton
                      bg="black"
                      color="white"
                      _expanded={{ bg: "gray.700" }}
                    >
                      <Box as="span" flex="1" textAlign="left">
                        Más sobre CHUEKS
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel bg="black" color="white">
                    {descriptionBlock}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </VStack>
        </Container>
      </Flex>
      <Flex
        w={{ base: "100%", md: "50%" }}
        bg="black"
        color="white"
        p={8}
        align="center"
        justify="center"
        display={{ base: "none", md: "flex" }}
      >
        {descriptionBlock}
      </Flex>
    </Flex>
  );
}
