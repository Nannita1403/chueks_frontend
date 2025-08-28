import { Box, Image, Text, Flex, Button } from "@chakra-ui/react"; 
import { CustomButton } from "../Button/Button.jsx";
import { useAuth } from "../../context/Auth/auth.context.jsx";

const ProductComponent = ({ product, onToggleLike, onViewDetail }) => {
  const { user } = useAuth();
  const isLiked = user ? product.likes?.includes(user.id) : false;

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg="white" _dark={{ bg: "gray.800" }}>
      <Image
        src={product.imgPrimary || "/placeholder.svg"}
        alt={product.name}
        mb={4}
        borderRadius="md"
      />
      <Text fontWeight="bold" mb={2}>{product.name}</Text>
      <Text mb={2}>${product.priceMin}</Text>

      <Flex align="center" gap={2} mt={2}>
        <CustomButton
          size="sm"
          isDisabled={!user}
          onClick={onToggleLike}
        >
          {isLiked ? "❤️" : "🤍"} {product.likes?.length || 0}
        </CustomButton>

        <Button size="sm" colorScheme="teal" onClick={onViewDetail}>
          Ver detalle
        </Button>
      </Flex>
    </Box>
  );
};

export default ProductComponent;
