import { Box, Skeleton, SkeletonText, VStack, HStack } from "@chakra-ui/react"

export function ProductCardSkeleton() {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" _dark={{ bg: "gray.800" }}>
      <Skeleton height="200px" borderRadius="md" mb={4} />
      <VStack align="start" spacing={2}>
        <Skeleton height="20px" width="80%" />
        <SkeletonText mt={2} noOfLines={2} spacing={2} />
        <HStack justify="space-between" w="full">
          <Skeleton height="16px" width="60px" />
          <Skeleton height="32px" width="80px" />
        </HStack>
      </VStack>
    </Box>
  )
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <VStack spacing={4} w="full">
      {Array.from({ length: rows }).map((_, index) => (
        <HStack key={index} spacing={4} w="full">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="40px" flex={1} />
          ))}
        </HStack>
      ))}
    </VStack>
  )
}

export const OrderCardSkeleton = () => (
  <Box borderWidth="1px" borderRadius="md" p={4} bg="white" _dark={{ bg: "gray.800" }}>
    <VStack align="start" spacing={2}>
      <HStack justify="space-between" w="full">
        <Skeleton height="20px" width="120px" />
        <Skeleton height="20px" width="60px" />
      </HStack>
      <Skeleton height="16px" width="100px" />
      <SkeletonText mt={2} noOfLines={2} spacing={2} />
    </VStack>
  </Box>
);
