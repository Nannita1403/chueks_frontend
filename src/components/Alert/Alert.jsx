import React from "react"
import {
  Alert as ChakraAlert,
  AlertIcon,
  AlertTitle as ChakraAlertTitle,
  AlertDescription as ChakraAlertDescription,
} from "@chakra-ui/react"

const Alert = React.forwardRef(({ variant = "subtle", status = "info", children, ...props }, ref) => {
  const getChakraStatus = (variant) => {
    switch (variant) {
      case "destructive":
        return "error"
      case "default":
        return "info"
      default:
        return status
    }
  }

  return (
    <ChakraAlert
      ref={ref}
      status={getChakraStatus(variant)}
      variant={variant === "destructive" ? "subtle" : variant}
      borderRadius="lg"
      {...props}
    >
      <AlertIcon />
      {children}
    </ChakraAlert>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ children, ...props }, ref) => (
  <ChakraAlertTitle ref={ref} fontWeight="medium" fontSize="sm" {...props}>
    {children}
  </ChakraAlertTitle>
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ children, ...props }, ref) => (
  <ChakraAlertDescription ref={ref} fontSize="sm" {...props}>
    {children}
  </ChakraAlertDescription>
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, AlertIcon }
