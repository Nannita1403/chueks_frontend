import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Text
} from '@chakra-ui/react';

import { useForm } from 'react-hook-form';

const RegisterForm = ({
  email, setEmail,
  password, setPassword,
  name, setName,
  telephone, setTelephone, onRegister
}) => {

  const { register, login, handleSubmit} =useForm();
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState("");

  return (
    <Box w="full" maxW="md" p={8} borderRadius="lg" boxShadow="lg">

        {/* Registrarse */}
        <TabsContent value="Registrarse">
          <Heading  size="lg" textAlign="left">Crear Cuenta</Heading>
          <Text fontSize="sm" color="gray.500" mb={6}>
            Regístrate para acceder a nuestro catálogo exclusivo Mayorista
          </Text>
          <form onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
            <VStack spacing={4}>
              <Fieldset.Root>
                <Field.Root required>
                  <Field.Label>Nombre</Field.Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Teléfono</Field.Label>
                    <Input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                    />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Email</Field.Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                </Field.Root>

                <Field.Root required>
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
    </Box>
  );
};

export default RegisterForm;
