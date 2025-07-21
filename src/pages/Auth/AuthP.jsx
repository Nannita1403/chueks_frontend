import InfoPanel from '../../components/LogiInfoPanel/InfoPanel';
import logoRedondo from "/logoRedondo.png"
import { login, registerUser} from "../../reducers/users/users.actions"
import { Box, Flex, Image, Tabs, Tab, TabList, Link, TabPanels, TabPanel, } from '@chakra-ui/react';
import React, { useState } from 'react'
import { LuLogIn, LuSquareCheck } from 'react-icons/lu';
import Register from '../../components/Register/Register';
import LoginForm from '../../components/LogiInfoPanel/LoginForm';

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
         <Tabs isFitted variant='enclosed' defaultValue="Iniciar-Sesion">
          <TabList mb="1em">
          <Tab to="/login" value="Iniciar-Sesion"><LuLogIn />Iniciar Sesión</Tab>
          <Tab to="/register" value="Registrarse"><LuSquareCheck /> Registrarse</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LoginForm/>
            </TabPanel>
            <TabPanel>
              <Register/>
            </TabPanel>
        </TabPanels>
          </Tabs>
        </Box>
      </Box>

      {/* Derecha - Información */}
      <InfoPanel/>

    </Flex>
  )
}

export default AuthP