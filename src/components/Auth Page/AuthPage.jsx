import React, { useState } from 'react';
import {
  Box,
  Flex,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

import AuthForm from './AuthForm';
import InfoPanel from './InfoPanel';
import { Toaster, toaster } from '../ui/toaster';

const BASE_URL = "http://localhost:3000/api/v1/";

toaster.create({
  title: "Toast Title",
  description: "Toast Description",
})

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

      toaster({ title: 'Login exitoso', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      toaster({ title: 'Error al iniciar sesión', description: error.message, status: 'error', duration: 3000, isClosable: true });
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

      toaster({ title: 'Registro exitoso', description: 'Verifica tu email para continuar.', status: 'success', duration: 4000, isClosable: true });
    } catch (error) {
      toaster({ title: 'Error al registrarse', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Flex height="100vh">
      {/* Izquierda - Formulario */}
      <Box flex="1" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <AuthForm
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          name={name} setName={setName}
          telephone={telephone} setTelephone={setTelephone}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </Box>

      {/* Derecha - Información */}
      <InfoPanel />
    </Flex>
  );
};

export default AuthPage;