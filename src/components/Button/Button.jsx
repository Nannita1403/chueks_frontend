import { Button } from "@chakra-ui/react"

const ButtonForm = ({
  children,
  width,
  type = "submit",
  onClick = () => {},
  invert,
}) => {
  return (
    <Button //size="md" variant="outline" rounded="lg"
      onClick={onClick}
      className={`main_button ${invert ? "invert" : ""}`}
      style={{ width: width }}
      type={type}
    >
      {children}
    </Button>
  );
};

export default ButtonForm;