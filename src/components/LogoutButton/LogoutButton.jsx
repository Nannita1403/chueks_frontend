import { useRef, useState } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../context/Auth/auth.context.jsx";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ variant = "solid", size = "md" }) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();
  const navigate = useNavigate();
  const toast = useToast();

  const onClose = () => setIsOpen(false);

  const handleLogout = () => {
    logout(); // usa el logout que limpia localStorage y redirige
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    onClose();
    navigate("/auth", { replace: true }); // seguridad extra
  };

  return (
    <>
      <Button
        colorScheme="red"
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
      >
        Salir
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cerrar sesión
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que quieres salir de tu cuenta?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Salir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
