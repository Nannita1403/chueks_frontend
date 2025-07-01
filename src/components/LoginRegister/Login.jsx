import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import FieldForm from "../FieldForm/FieldForm";
import { login } from "../../reducers/users/users.actions";
import { useContext, useEffect, useState } from "react";
import AlertForm from "../AlertForm/AlerForm";
import { UsersContext } from "../../providers/UsersProviders";
import {  Box,
  Input,
  VStack,
  Heading,
  Field,
  Fieldset,
  TabsContent,
  Text, } from "@chakra-ui/react";
import { PasswordInput } from '../ui/password-input.jsx';
import Form from "../Form/Form";
import ButtonForm from "../Button/Button";
  

const Login = ({  email, setEmail,
  password, setPassword, onLogin}) => {
  const {
    register,
    handleSubmit,
    setError, 
    formState: { errors },
  } = useForm();
   const [visible, setVisible] = useState(false)
  const { state, dispatch } = useContext(UsersContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.error) {
      setError("errorApi", { message: state.error });
    }
  }, [state.error]);

  return (
    <Box w="full" maxW="md" p={8} borderRadius="lg" boxShadow="lg">
    <TabsContent value="Iniciar-Sesion">
    <Heading  size="lg" textAlign="left">Inicia Sesión</Heading>
    <Text fontSize="sm" color="gray.500" mb={6}>
      Accede a tu cuenta exclusiva a Mayoristas
    </Text>
    <AlertForm errors={errors} />
    <Form
      handleSubmit={handleSubmit}
      submit={(data) => login(data, dispatch, navigate)}
      register={register}
      buttonText="Login"
    >
     <VStack spacing={4}>
       <Fieldset.Root>
        <Field.Root required>
            <Field.Label>Email</Field.Label>
                <Input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 validations={{
                    required: { value: true, message: "El email es requerido" },
                    pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Debes introducir un formato de email correcto",
                    },
                    }}
                />
        </Field.Root>

        <Field.Root required>
            <Field.Label>Contraseña</Field.Label>
                <PasswordInput
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 visible={visible}
                 onVisibleChange={setVisible}
                 validations={{
                    required: { value: true, message: "Introduce la contraseña" },
                }}
                />
        </Field.Root>
       </Fieldset.Root>
       <Text fontSize="sm" color="gray.500">
        La contraseña está {visible ? "visible" : "oculta"}
        </Text>
       
        <ButtonForm type="submit" colorPalette="blue" width="full">
        Iniciar Sesión
        </ButtonForm>
        <Link to="/register">¿No tienes cuenta? Regístrate</Link>
     </VStack>
    </Form>
    </TabsContent>
    </Box>
    
  );
};

export default Login;