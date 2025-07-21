import { useContext } from "react";
import { FormContext } from "../Form/Form";
import {  Flex, Input, Tag } from "@chakra-ui/react";

const FieldForm = ({
  label,
  type = "text",
  ph = "",
  registerName,
  validations = {},
}) => {
  const { register } = useContext(FormContext);

  return (
    <Flex flexDir="column" gap="15px" marginTop="20px" width="100%"> 
      <Tag fontWeight="600" fontSize="16px">{label}</Tag>
      <Input borderRadius="8px" border={"1px solid #e2e2e2"} fontSize="16px" padding="10px"
        variant="subtitle" size="sm"
        placeholder={ph}
        type={type}
        {...register(registerName, validations)}
      />
    </Flex>
  );
};

export default FieldForm;