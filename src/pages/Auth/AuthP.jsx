import InfoPanel from '../../components/LogiInfoPanel/InfoPanel';
import logoRedondo from "/logoRedondo.png"
import { Box, Flex, Image, Tabs, Tab, TabList, Link, TabPanels, TabPanel, SimpleGrid, Container, useColorModeValue, } from '@chakra-ui/react';
import React from 'react'
import Register from '../../components/Register/Register';
import LoginForm from '../../components/LogiInfoPanel/LoginForm';

const BASE_URL = "http://localhost:3000/api/v1/";

const AuthP = () => {
const bgColor = useColorModeValue("white", "gray.800")

  return (
    <Flex minH={'100svh'} bg={bgColor}>
    <Flex as={SimpleGrid} flexDir={{base:'column', md:'row'}} justifyItems={'center'} justifyContent={'center'} alignItems={'center'} columns={{ base: 1, md: 2 }} spacing={{ base: 2, lg: 4 }}  py={{ base:5, sm: 7, lg: 9 }}> 
      {/* Izquierda - Formulario */}
      <Box display="flex" flexDir={`column`} justifyItems="center" alignContent="center" alignItems="center"  borderRadius="lg" boxShadow="lg">
      <Image mb={6} src={logoRedondo} alt="Logo de la marca" />
      <Box display="flex" flexDir="column"  alignItems="center" justifyContent="center">
        {window.location.pathname === "/login" ? <LoginForm /> : <Register />}
        </Box>
      </Box>

      {/* Derecha - Información */}
      <Box display="flex" justifyItems="center" alignContent="center" alignItems="center"  >
      <InfoPanel/>
    </Box>
    </Flex>
    </Flex>
  )
}

export default AuthP