import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Text, Spinner, Button } from "@chakra-ui/react";
import ApiService from "../../reducers/api/Api.jsx";

const VerifyAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"

  useEffect(() => {
    const verify = async () => {
      try {
        const resp = await ApiService.get(`/users/verifyaccount/${id}`);
        console.log("✅ Verificación:", resp);
        setStatus("success");
      } catch (err) {
        console.error("❌ Error verificando cuenta:", err);
        setStatus("error");
      }
    };

    if (id) {
      verify();
    }
  }, [id]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
      px={6}
    >
      {status === "loading" && (
        <>
          <Spinner size="xl" />
          <Text mt={4}>Verificando tu cuenta…</Text>
        </>
      )}

      {status === "success" && (
        <>
          <Text fontSize="2xl" fontWeight="bold" color="green.500">
            🎉 Tu cuenta ha sido verificada con éxito
          </Text>
          <Button mt={6} colorScheme="pink" onClick={() => navigate("/auth/login")}>
            Ir a Iniciar Sesión
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <Text fontSize="2xl" fontWeight="bold" color="red.500">
            ❌ El enlace de verificación no es válido o ya fue usado
          </Text>
          <Button mt={6} colorScheme="pink" onClick={() => navigate("/auth/register")}>
            Crear nueva cuenta
          </Button>
        </>
      )}
    </Box>
  );
};

export default VerifyAccount;