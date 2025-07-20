import { useContext } from "react";
import { FormContext } from "../Form/Form";
import { Box, Input, Tag } from "@chakra-ui/react";

const FieldForm = ({
  label,
  type = "text",
  ph = "",
  registerName,
  validations = {},
}) => {
  const { register } = useContext(FormContext);

  return (
    <Box>
      <Tag>{label}</Tag>
      <Input
        variant="subtitle" 
        size="sm"
        placeholder={ph}
        type={type}
        {...register(registerName, validations)}
      />
    </Box>
  );
};

export default FieldForm;