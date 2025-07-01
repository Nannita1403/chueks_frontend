import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { verifyAccount } from "../../reducers/users/users.actions";
import { UsersContext } from "../../providers/UsersProviders";
import { Box, Text } from "@chakra-ui/react";

const VerifyAccount = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(UsersContext);
  const navigate = useNavigate();
  const { user } = state;

  useEffect(() => {
    if (id) {
      verifyAccount(id, dispatch, navigate);
    }
  }, [id]);

  return (
    <Box display="flex" padding="30px" justifyContent={center} alignItems={center}>
      {user?.verified ? (
        <Text>Se ha verificado tu cuenta con éxito</Text>
      ) : (
        <Text>Verifica tu correo electrónico para activar tu cuenta</Text>
      )}
    </Box>
  );
};

export default VerifyAccount;