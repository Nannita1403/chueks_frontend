import React from "react"
import { Box, Flex, Text, Heading } from "@chakra-ui/react"

const CustomCard = React.forwardRef(({ children, variant = "outline", ...props }, ref) => (
  <Box
    ref={ref}
    borderWidth="1px"
    borderRadius="lg"
    bg="white"
    shadow="sm"
    _dark={{ bg: "gray.800", borderColor: "gray.600" }}
    {...props}
  >
    {children}
  </Box>
))
CustomCard.displayName = "CustomCard"

const CardHeader = React.forwardRef(({ children, ...props }, ref) => (
  <Box ref={ref} p={6} {...props}>
    {children}
  </Box>
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ children, ...props }, ref) => (
  <Heading ref={ref} size="lg" fontWeight="semibold" lineHeight="none" {...props}>
    {children}
  </Heading>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ children, ...props }, ref) => (
  <Text ref={ref} fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} {...props}>
    {children}
  </Text>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ children, ...props }, ref) => (
  <Box ref={ref} px={6} pb={6} {...props}>
    {children}
  </Box>
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ children, ...props }, ref) => (
  <Flex ref={ref} align="center" px={6} pb={6} {...props}>
    {children}
  </Flex>
))
CardFooter.displayName = "CardFooter"

export { CustomCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
    