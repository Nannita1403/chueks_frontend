import InfoPanel from '../../components/LoginRegister/InfoPanel';
import logoRedondo from "/logoRedondo.png"
import { login, registerUser} from "../../reducers/users/users.actions"
import { Box, Flex, Image, Tabs, Tab, TabList, } from '@chakra-ui/react';
import React, { useState } from 'react'
import { LuLogIn, LuSquareCheck } from 'react-icons/lu';
import Register from '../../components/Register/Register';
import LoginForm from '../../components/LoginRegister/LoginForm';

const BASE_URL = "http://localhost:3000/api/v1/";

const AuthP = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [telephone, setTelephone] = useState('');

  return (
    <Flex  height="100vh" justifyContent="center" alignItems="center" >
      {/* Izquierda - Formulario */}
      <Box flex={1} justifyItems="center" alignItems="center" w="full" maxW="md" p={8} borderRadius="lg" boxShadow="lg">
      <Image mb={6} src={logoRedondo} alt="Logo de la marca" />
      <Box flex="1" display="flex" flexDir="column"  alignItems="center" justifyContent="center">
         <Tabs isFitted variant='enclosed' defaultValue="Iniciar-Sesion"> //*maxW="md" colorScheme="blue"
          <TabList mb="1em">
          <Tab value="Iniciar-Sesion"><LuLogIn />Iniciar Sesión</Tab>
          <Tab value="Registrarse"><LuSquareCheck /> Registrarse</Tab>
          </TabList>
        
      {window.location.pathname === "/login" 
      ? 
      //<Login
       <LoginForm
         email={email} setEmail={setEmail}
         onLogin={login}
        />
      :
       <Register
        email={email} setEmail={setEmail}
         password={password} setPassword={setPassword}
        name={name} setName={setName}
        telephone={telephone} setTelephone={setTelephone}
        onRegister={registerUser}
        />}
        <Register/>
          </Tabs>
        </Box>
      </Box>

      {/* Derecha - Información */}
      <InfoPanel/>

    </Flex>
  )
}

export default AuthP