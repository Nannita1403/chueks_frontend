import React, { useState } from 'react';

import {
  Box,
  Flex,
  VStack,
  useColorModeValue,
  Image,
  SimpleGrid,
} from "@chakra-ui/react"
import logoRedondo from "/logoRedondo.png"
import Register from '../../components/Register/Register';
import LoginForm from '../../components/LogiInfoPanel/LoginForm';
import InfoPanel from '../../components/LogiInfoPanel/InfoPanel';


const BASE_URL = "http://localhost:3000/api/v1/";

export default function AuthPage () {
  const bgColor = useColorModeValue("white", "gray.800")

  return (
    <Flex minH="100vh" bg={bgColor} as={SimpleGrid} flexDir={{base:'column', md:'row'}} alignContent={'center'} justifyContent={'center'}>
      {/* Form Section */}
      <Flex w={{ base: "100%", md: "50%" }} align="center" justify="center" p={8} justifyContent="center">
        <Box w="full" maxW="md">
          <VStack spacing={8} align="center">
            <VStack spacing={4} align="center">
               <Image mb={6} src={logoRedondo} alt="Logo de la marca" />
            </VStack>
            <Box  w="full" display="flex" flexDir="column"  alignItems="center" justifyContent="center">
              {window.location.pathname === "/login" ? <LoginForm /> : <Register />}
             </Box>
          </VStack>
      </Box>
      </Flex>

      {/* Description Section */}
      <InfoPanel/>
    </Flex>

  )
}
