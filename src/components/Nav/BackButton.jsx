// src/components/Nav/BackButton.jsx
import { Button, Icon } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function BackButton({ children = "Volver" }) {
  const navigate = useNavigate();
  return (
    <Button variant="ghost" leftIcon={<Icon as={FiArrowLeft} />} onClick={() => navigate(-1)}>
      {children}
    </Button>
  );
}
