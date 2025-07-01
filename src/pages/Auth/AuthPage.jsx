import React, { useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Tabs,
  TabsList,
} from '@chakra-ui/react';
import { useColorModeValue } from '../../components/ui/color-mode';
import InfoPanel from '../../components/LoginRegister/InfoPanel';
import logoRedondo from "/logoRedondo.png"
import { LuLogIn, LuSquareCheck } from 'react-icons/lu';
import LoginForm from '../../components/LoginRegister/LoginForm';
import RegisterForm from '../../components/LoginRegister/RegisterForm';
import { login, register } from '../../reducers/users/users.actions';


const BASE_URL = "http://localhost:3000/api/v1/";
const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');

  const bgColor =useColorModeValue('white', 'gray.800');

  return (
    <Flex height="100vh">
      {/* Izquierda - Formulario */}
      <Box w="full" maxW="md" p={8} borderRadius="lg" boxShadow="lg">
      <Image mb={6} src={logoRedondo} alt="Logo de la marca" />
      <Box flex="1" bg={bgColor} display="flex" flexDir="column"  alignItems="center" justifyContent="center">
         <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue="Iniciar-Sesion" colorScheme="blue">
          <TabsList>
          <Tabs.Trigger value="Iniciar-Sesion"><LuLogIn /> Iniciar Sesión</Tabs.Trigger>
          <Tabs.Trigger value="Registrarse"><LuSquareCheck /> Registrarse</Tabs.Trigger>
          </TabsList>
        
      {window.location.pathname === "/login" 
      ? 
        <LoginForm
//         email={email} setEmail={setEmail}
 //         onLogin={login}
        />
      :
       <RegisterForm
       //   email={email} setEmail={setEmail}
       //   password={password} setPassword={setPassword}
       //   name={name} setName={setName}
       //   telephone={telephone} setTelephone={setTelephone}
       //   onRegister={register}
        />}
          </Tabs.Root>
        </Box>
      </Box>

      {/* Derecha - Información */}
      <InfoPanel />

    </Flex>
  );
};

export default AuthPage;