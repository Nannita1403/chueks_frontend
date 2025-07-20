import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../../reducers/users/users.actions";
import { useContext, useEffect, useState } from "react";
import AlertForm from "../AlertForm/AlerForm";
import { UsersContext } from "../../providers/UsersProviders";
import {  Box,
  Input,
  Heading,
  Text,
  Flex,
  Stack,
  FormLabel} from "@chakra-ui/react";
import Form from "../Form/Form";
//import ButtonForm from "../Button/Button";
import FieldForm from "../FieldForm/FieldForm";
  

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError, 
    formState: { errors },
  } = useForm();
  const { state, dispatch } = useContext(UsersContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.error) {
      setError("errorApi", { message: state.error });
    }
  }, [state.error]);

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      borderRadius="lg" boxShadow="lg">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Inicia Sesión</Heading>
          <Text fontSize={'sm'} color={'gray.500'}>
            Accede a tu cuenta exclusiva a Mayoristas <Text color={'blue.400'}>features</Text> ✌️
          </Text>
        </Stack>
        <AlertForm errors={errors} />
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          p={8}>
        <Form
            handleSubmit={handleSubmit}
            submit={(data) => login(data, dispatch, navigate)}
            register={register}
            buttonText="Login">
          <Stack spacing={4}>
            <FieldForm 
            isRequired id="email">
              <FormLabel>Email</FormLabel>
              <Input type="email" 
              value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 validations={{
                    required: { value: true, message: "El email es requerido" },
                    pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Debes introducir un formato de email correcto",
                    },
                    }}/>
            </FieldForm>
            <FieldForm id="password">
            <FormLabel>Password</FormLabel>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  placeholder='Password'
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                  {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FieldForm>
            <Stack spacing={10}>
              <Link to="/register">¿No tienes cuenta? Regístrate</Link>
            </Stack>
          </Stack>
        </Form>
        </Box>
      </Stack>
    </Flex>
    
  );
};

export default LoginForm;