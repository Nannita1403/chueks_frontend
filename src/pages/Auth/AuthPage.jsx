import React, { useState } from 'react';
import { Box, Flex, Image, Tabs, Tab, TabsList, Stack } from '@chakra-ui/react';
import InfoPanel from '../../components/LoginRegister/InfoPanel';
import logoRedondo from "/logoRedondo.png"
import { LuLogIn, LuSquareCheck } from 'react-icons/lu';
import RegisterForm from '../../components/LoginRegister/RegisterForm';
import { login, register } from '../../reducers/users/users.actions';
import LoginForm from '@/components/LoginRegister/LoginForm';


const BASE_URL = "http://localhost:3000/api/v1/";
const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');


  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      
      {/* Izquierda - Formulario */}
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
       <Stack spacing={4} w={'full'} maxW={'md'}>
        <Image mb={6} src={logoRedondo} alt="Logo de la marca" />
          <Box flex="1" bg={bgColor} display="flex" flexDir="column"  alignItems="center" justifyContent="center">
          <Tabs variant="enclosed" maxW="md" fitted default Value="Iniciar-Sesion" colorScheme="blue">
          <TabsList>
          <Tab value="Iniciar-Sesion"><LuLogIn />Iniciar Sesión</Tab>
          <Tab value="Registrarse"><LuSquareCheck /> Registrarse</Tab>
            </TabsList>
            {window.location.pathname === "/login" 
            ? 
            <LoginForm
             email={email} setEmail={setEmail}
             onLogin={login}
             />
            :
            <RegisterForm
             email={email} setEmail={setEmail}
         password={password} setPassword={setPassword}
        name={name} setName={setName}
        telephone={telephone} setTelephone={setTelephone}
             onRegister={register}
             />}
            <RegisterForm/>
            </Tabs>
          </Box>
        </Stack>
      </Flex>
      {/* Derecha - Información */}
      <Flex flex={1}>
        <InfoPanel />
      </Flex>
    </Stack>
  );
};

export default AuthPage;