import { useRef, useState } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../Hooks/useToast.jsx";

export default function LogoutButton({ variant = "solid", size = "md", children }) {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();
  const navigate = useNavigate();
const { toast } = useToast();

  const onClose = () => setIsOpen(false);

  const handleLogout = () => {
    // 🔴 Borra TODO lo que haya en localStorage
    localStorage.clear();

    // Notificación
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    onClose();

    // 🔴 Redirige siempre al login correcto
    navigate("/auth", { replace: true });
  };

  return (
    <>
      <Button
        colorScheme="red"
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        w="full"
      >
        {children || "Salir"}
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
