import { Box, Image, Text } from "@chakra-ui/react";

const Alert = ({ children }) => {
  return (
    <Box padding="10px 35px 0px 35px" borderRadius="10px" fontWeight={500} color="#ff0000"
    flex={1} justifyContent={start} alignItems={start} flexDir={column} position={relative}>
      <Box flex={1} alignItems={center} gap="20px">
        <Image w="20px" position={absolute} top="10px" left="10px" src="/icons/error.png" alt="error" />
        <Text fontSize="16px">Error</Text>
      </Box>
      <Text fontSize="14px" p="10px 0px" 
      maxW={auto} minW={auto} textAlign={start} color="ActiveCaption"  >
     {children}</Text>
    </Box>
  );
};

export default Alert;