import { useToast as useChakraToast } from "@chakra-ui/react";

function useToast() {
  const chakraToast = useChakraToast();

  const toast = ({ ...props }) => {
    const id = props.id || Math.random().toString(36).slice(2);

    chakraToast({
      id,
      position: "top-right",
      duration: 3000,
      isClosable: true,
      ...props,
    });

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

  const dismiss = (toastId) => {
    if (toastId) chakraToast.close(toastId);
    else chakraToast.closeAll();
  };

  return { toast, dismiss };
}

export { useToast };
