// Hooks/useToast.jsx
import { useToast as useChakraToast } from "@chakra-ui/react";

/**
 * Hook personalizado que envuelve el toast de Chakra.
 * Mantiene la misma API que tu versión previa: useToast() → { toast, dismiss }
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

    // Retorna handlers compatibles con tu API anterior
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

  // Dismiss manual
  const dismiss = (toastId) => {
    if (toastId) {
      chakraToast.close(toastId);
    } else {
      chakraToast.closeAll();
    }
  };

  return {
    toast,
    dismiss,
  };
}

// También exportamos la función toast directamente
const toast = (options) => {
  const { toast } = useToast();
  return toast(options);
};

export { useToast, toast };
