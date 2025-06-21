import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Tabs,
  Heading,
  Field,
  Fieldset,
  TabsList,
  TabsContent,
  Text,
} from '@chakra-ui/react';
import { LuLogIn, LuSquareCheck } from 'react-icons/lu';
import { PasswordInput } from '..//ui/password-input.jsx';


const AuthForm = ({
  email, setEmail,
  password, setPassword,
  name, setName,
  telephone, setTelephone,
  onLogin, onRegister
}) => {

  const [visible, setVisible] = useState(false)

  return (
    <Box w="full" maxW="md" p={8} borderRadius="lg" boxShadow="lg">


      <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue="Iniciar-Sesion" colorScheme="blue">
        <TabsList>
          <Tabs.Trigger value="Iniciar-Sesion"><LuLogIn /> Iniciar Sesión</Tabs.Trigger>
          <Tabs.Trigger value="Registrarse"><LuSquareCheck /> Registrarse</Tabs.Trigger>
        </TabsList>

        {/* Iniciar Sesión */}
        <TabsContent value="Iniciar-Sesion">
         <Heading  size="lg" textAlign="left">Inicia Sesión</Heading>
          <Text fontSize="sm" color="gray.500" mb={6}>
             Accede a tu cuenta exclusiva a Mayoristas
          </Text>
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <VStack spacing={4}>
              <Fieldset.Root>
                <Field.Root isRequired>
                  <Field.Label>Email</Field.Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                </Field.Root>

                <Field.Root isRequired>
                  <Field.Label>Contraseña</Field.Label>
                    <PasswordInput
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      visible={visible}
                      onVisibleChange={setVisible}
                    />
                </Field.Root>
              </Fieldset.Root>
              <Text fontSize="sm" color="gray.500">
                La contraseña está {visible ? "visible" : "oculta"}
              </Text>

              <button type="submit" colorScheme="blue" width="full">
                Iniciar Sesión
              </button>
            </VStack>
          </form>
        </TabsContent>

        {/* Registrarse */}
        <TabsContent value="Registrarse">
          <Heading  size="lg" textAlign="left">Crear Cuenta</Heading>
          <Text fontSize="sm" color="gray.500" mb={6}>
            Regístrate para acceder a nuestro catálogo exclusivo Mayorista
          </Text>
          <form onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
            <VStack spacing={4}>
              <Fieldset.Root>
                <Field.Root isRequired>
                  <Field.Label>Nombre</Field.Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                </Field.Root>

                <Field.Root isRequired>
                  <Field.Label>Teléfono</Field.Label>
                    <Input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                    />
                </Field.Root>

                <Field.Root isRequired>
                  <Field.Label>Email</Field.Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                </Field.Root>

                <Field.Root isRequired>
                  <Field.Label>Contraseña</Field.Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                </Field.Root>
              </Fieldset.Root>

              <Button type="submit" colorScheme="blue" width="full">
                Registrarse
              </Button>
            </VStack>
          </form>
        </TabsContent>
      </Tabs.Root>
    </Box>
  );
};

export default AuthForm;
