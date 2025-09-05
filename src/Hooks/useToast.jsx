// src/Hooks/useToast.jsx
import { useToast as useChakraToast } from "@chakra-ui/react";

/**
 * Hook personalizado que envuelve el toast de Chakra.
 * Uso:
 *   const { toast, dismiss } = useToast();
 *   toast({ title: "Guardado", status: "success" });
 */
function useToast() {
  const chakraToast = useChakraToast();

  // Mostrar un toast
  const toast = ({ ...props }) => {
    const id = props.id || Math.random().toString(36).slice(2);

    chakraToast({
      id,
      position: "top-right",
      duration: 3000,
      isClosable: true,
      ...props,
    });

    // Retorna handlers opcionales
    return {
      id,
      dismiss: () => chakraToast.close(id),
      update: (newProps) =>
        chakraToast.update(id, {
          position: "top-right",
          duration: 3000,
          isClosable: true,
          ...newProps,
        }),
    };
  };

  // Cerrar un toast o todos
  const dismiss = (toastId) => {
    if (toastId) chakraToast.close(toastId);
    else chakraToast.closeAll();
  };

  return { toast, dismiss };
}

export { useToast };
