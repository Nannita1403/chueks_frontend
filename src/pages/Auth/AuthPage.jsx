import React, { useState } from 'react';
import { Box, Flex, Image, Tabs, TabsContent, TabsList } from '@chakra-ui/react';
import InfoPanel from '../../components/LoginRegister/InfoPanel';
import logoRedondo from "/logoRedondo.png"
import { LuLogIn, LuSquareCheck } from 'react-icons/lu';
import RegisterForm from '../../components/LoginRegister/RegisterForm';
import { login, register } from '../../reducers/users/users.actions';
import Login from '../../components/LoginRegister/Login';


const BASE_URL = "http://localhost:3000/api/v1/";
const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');


  return (
    <Flex  height="100vh" justifyContent="center" alignItems="center" >
      {/* Izquierda - Formulario */}
      <Box flex={1} justifyItems="center" alignItems="center" w="full" maxW="md" p={8} borderRadius="lg" boxShadow="lg">
      <Image mb={6} src={logoRedondo} alt="Logo de la marca" />
      <Box flex="1" bg={bgColor} display="flex" flexDir="column"  alignItems="center" justifyContent="center">
         <Tabs variant="enclosed" maxW="md" fitted defaultValue="Iniciar-Sesion" colorScheme="blue">
          <TabsList>
          <TabsContent value="Iniciar-Sesion"><LuLogIn />Iniciar Sesión</TabsContent>
          <TabsContent value="Registrarse"><LuSquareCheck /> Registrarse</TabsContent>
          </TabsList>
        
      {window.location.pathname === "/login" 
      ? 
      <Login
    //    <LoginForm
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
      </Box>

      {/* Derecha - Información */}
      <InfoPanel />

    </Flex>
  );
};

export default AuthPage;