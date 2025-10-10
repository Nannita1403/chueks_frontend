import React from "react"
import { Input as ChakraInput } from "@chakra-ui/react"

const Input = React.forwardRef(({ size = "md", variant = "outline", ...props }, ref) => {
  return (
    <ChakraInput
      ref={ref}
      size={size}
      variant={variant}
      focusBorderColor="brand.500"
      errorBorderColor="red.500"
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
