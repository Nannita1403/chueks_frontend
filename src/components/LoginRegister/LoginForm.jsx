import React, { useContext, useState } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Field,
  Fieldset,
  TabsContent,
  Text,
} from '@chakra-ui/react';
import { PasswordInput } from '../ui/password-input.jsx';
import { useForm } from 'react-hook-form';
import { UsersContext } from '../../providers/UsersProviders.jsx';

const LoginForm = ({
  email, setEmail,
  password, setPassword, onLogin
}) => {

  const { register, login, handleSubmit, setError, formState:{errors}} =useForm();
  const {state, dispatch} = useContext(UsersContext);
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState("");

  return (
    <Box w="full" maxW="md" p={8} borderRadius="lg" boxShadow="lg">

        {/* Iniciar Sesión */}
        <TabsContent value="Iniciar-Sesion">
         <Heading  size="lg" textAlign="left">Inicia Sesión</Heading>
          <Text fontSize="sm" color="gray.500" mb={6}>
             Accede a tu cuenta exclusiva a Mayoristas
          </Text>
          {/*          <form onSubmit={handleSubmit(onSubmit)}> */}         
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <VStack spacing={4}>
              <Fieldset.Root>
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

              <Button type="submit" colorPalette="blue" width="full">
                Iniciar Sesión
              </Button>
            </VStack>
          </form>
        </TabsContent>
    </Box>
  );
};

export default LoginForm;
