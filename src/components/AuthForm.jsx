import React from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
} from '@chakra-ui/react';

const AuthForm = ({
  email, setEmail,
  password, setPassword,
  name, setName,
  telephone, setTelephone,
  onLogin, onRegister
}) => {
  return (
    <Box w="full" maxW="md" p={8} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} size="lg" textAlign="center">Bienvenido</Heading>
      <Tabs variant="enclosed" colorScheme="brand" isFitted>
        <TabList>
          <Tab>Iniciar Sesión</Tab>
          <Tab>Registrarse</Tab>
        </TabList>

        <TabPanels>
          <Fieldset.Content>
            <VStack spacing={4}>
              <Field.Root isRequired>
                <Field.Label>Email</Field.Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field.Root>

              <Field.Root isRequired>
                <Field.Label>Contraseña</Field.Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field.Root>

              <Button colorScheme="brand" width="full" onClick={onLogin}>
                Iniciar Sesión
              </Button>
            </VStack>
          </Fieldset.Content>

          <Fieldset.Content>
            <VStack spacing={4}>
              <Field.Root isRequired>
                <Field.Label>Nombre</Field.Label>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </Field.Root>

              <Field.Root isRequired>
                <Field.Label>Teléfono</Field.Label>
                <Input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
              </Field.Root>

              <Field.Root isRequired>
                <Field.Label>Email</Field.Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field.Root>

              <Field.Root isRequired>
                <Field.Label>Contraseña</Field.Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field.Root>

              <Button colorScheme="brand" width="full" onClick={onRegister}>
                Registrarse
              </Button>
            </VStack>
          </Fieldset.Content>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AuthForm;