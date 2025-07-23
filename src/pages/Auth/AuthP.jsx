import InfoPanel from '../../components/LogiInfoPanel/InfoPanel';
import logoRedondo from "/logoRedondo.png"
import { login, registerUser} from "../../reducers/users/users.actions"
import { Box, Flex, Image, Tabs, Tab, TabList, Link, TabPanels, TabPanel, SimpleGrid, Container, } from '@chakra-ui/react';
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
    <Container flex={1} minH={'100svh'} maxW={'3xl'} position="relative" alignContent={'center'}>
    <Flex as={SimpleGrid} flexDir={{base:'column', md:'row'}} justifyItems={'center'} justifyContent={'center'} alignItems={'center'} columns={{ base: 1, md: 2 }} spacing={{ base: 2, lg: 4 }}  py={{ base:5, sm: 7, lg: 9 }}> 
      {/* Izquierda - Formulario */}
      <Box display="flex" flexDir={`column`} justifyItems="center" alignContent="center" alignItems="center"  borderRadius="lg" boxShadow="lg">
      <Image mb={6} src={logoRedondo} alt="Logo de la marca" />
      <Box display="flex" flexDir="column"  alignItems="center" justifyContent="center">
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
      <Box display="flex" justifyItems="center" alignContent="center" alignItems="center"  >
      <InfoPanel/>
    </Box>
    </Flex>
    </Container>
  )
}

export default AuthP