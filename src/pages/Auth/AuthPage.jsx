import React, { useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Tabs,
} from '@chakra-ui/react';
import { Toaster, toaster } from "../../components/ui/toaster"
import { useColorModeValue } from '../../components/ui/color-mode';
import InfoPanel from '../../components/LoginRegister/InfoPanel';
import logoRedondo from "/logoRedondo.png"
import { LuLogIn, LuSquareCheck } from 'react-icons/lu';
import LoginForm from '../../components/LoginRegister/LoginForm';
import RegisterForm from '../../components/LoginRegister/RegisterForm';


const BASE_URL = "http://localhost:3000/api/v1/";
<Toaster />
const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');

  const bgColor =useColorModeValue('white', 'gray.800');

  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      Toaster({ title: 'Login exitoso', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      Toaster({ title: 'Error al iniciar sesión', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`${BASE_URL}register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, telephone, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data);

      Toaster({ title: 'Registro exitoso', description: 'Verifica tu email para continuar.', status: 'success', duration: 4000, isClosable: true });
    } catch (error) {
      Toaster({ title: 'Error al registrarse', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Flex height="100vh">
      {/* Izquierda - Formulario */}
      <Box w="full" maxW="md" p={8} borderRadius="lg" boxShadow="lg">
         <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue="Iniciar-Sesion" colorScheme="blue">
          <TabsList>
          <Tabs.Trigger value="Iniciar-Sesion"><LuLogIn /> Iniciar Sesión</Tabs.Trigger>
          <Tabs.Trigger value="Registrarse"><LuSquareCheck /> Registrarse</Tabs.Trigger>
          </TabsList>


      <Box flex="1" bg={bgColor} display="flex" flexDir="column"  alignItems="center" justifyContent="center">
        <Image mb={6} src={logoRedondo} alt="Logo de la marca" />
        <LoginForm
          email={email} setEmail={setEmail}
          onLogin={handleLogin}
        />
        <RegisterForm
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          name={name} setName={setName}
          telephone={telephone} setTelephone={setTelephone}
          onRegister={handleRegister}
        />

      </Box>

      {/* Derecha - Información */}
      <InfoPanel />
          </Tabs.Root>
        </Box>
    </Flex>
  );
};

export default AuthPage;