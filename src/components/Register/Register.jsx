import { Link, useNavigate } from "react-router-dom";
import FieldForm from "../FieldForm/FieldForm";
import Form from "../Form/Form";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import AlertForm from "../../components/AlertForm/AlerForm";
import { UsersContext } from "../../providers/UsersProviders";
import { registerUser } from "../../reducers/users/users.actions";
import { Stack, Text } from "@chakra-ui/react";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { dispatch } = useContext(UsersContext);
  const navigate = useNavigate();

  return (
    <Form
      handleSubmit={handleSubmit}
      submit={(data) => registerUser(data, dispatch, navigate)}
      register={register}
      buttonText="Registrarse"
    >
      <Text color="brand.0" fontWeight="800" fontSize="25px">Registrarse</Text>
      <Text color="brand.500">Crea una cuenta nueva</Text>
      <AlertForm errors={errors}/>
      <Stack spacing={4}>
      <FieldForm
        label="Nombre"
        ph="Tu nombre"
        registerName="name"
        validations={{
          required: { value: true, message: "El nombre es requerido" },
          maxLength: {
            value: 30,
            message: "El nombre de usuario es demasiado largo",
          },
        }}
      />
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
    <Stack spacing={10}/>
    <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
    </Stack>
    </Form>
    
  );
};

export default Register;