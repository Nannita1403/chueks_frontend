import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../../reducers/users/users.actions";
import { useContext, useEffect, useState } from "react";
import AlertForm from "../AlertForm/AlerForm";
import { UsersContext } from "../../providers/UsersProviders";
import { 
  Text,
  Stack} from "@chakra-ui/react";
import Form from "../Form/Form";
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
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  useEffect(() => {
    if (state.error) {
      setError("errorApi", { message: state.error });
    }
  }, [state.error]);

  return (
    <Form
        handleSubmit={handleSubmit}
        submit={(data) => login(data, dispatch, navigate)}
        register={register}
        buttonText="Login">
        <Text color="brand.0" fontWeight="800" fontSize="25px">Iniciar Sesión</Text>
        <Text color="brand.500">Accede a tu cuenta exclusiva a Mayoristas</Text>
          <AlertForm errors={errors} />
          <Stack spacing={4}>
            <FieldForm 
             label="Correo electrónico"
             ph="tu@email.com"
             registerName="email"
             validations={{
              required: { value: true, message: "El email es requerido" },
              pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Debes introducir un formato de email correcto",
                },
              }}
            />
            <FieldForm
        label="Contraseña"
        ph="*********"
        type="password"
        registerName="password"
        validations={{
          required: { value: true, message: "La contraseña es requerida" },
        }}
      />
      <Link to="/register">¿No tienes cuenta? Regístrate</Link>
            <Stack spacing={10}/>
    
          </Stack>
        </Form>
    
  );
};

export default LoginForm;