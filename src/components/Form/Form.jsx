import { createContext } from "react";
import Button from "../Button/Button";
import { Box, FieldsetRoot, Flex } from "@chakra-ui/react";

export const FormContext = createContext();

const Form = ({
  children,
  handleSubmit,
  submit,
  register,
  buttonText = "Enviar",
}) => {
  return (
    <Flex w="40%" flex={1} maxW="500px" minW="300px" backgroundColor="#FFFFFF" borderRadius="8px"
    direction="column" alignItems="center" justifyContent= "center" paddingX="20px" paddingY="30px" 
    gap="5px" position="relative" >
    <FieldsetRoot onSubmit={handleSubmit(submit)}>
      <FormContext.Provider value={{ register }}>
        {children}
      </FormContext.Provider>
      <Button margin="15px 0px 0px 0px" w="100%" >{buttonText}</Button>
    </FieldsetRoot>
    </Flex>
  );
};

export default Form;