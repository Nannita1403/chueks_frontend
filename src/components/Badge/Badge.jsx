import { Badge as ChakraBadge } from "@chakra-ui/react"

function Badge({ variant = "solid", colorScheme = "brand", children, ...props }) {
  const getChakraProps = (variant) => {
    switch (variant) {
      case "default":
        return { variant: "solid", colorScheme: "brand" }
      case "secondary":
        return { variant: "solid", colorScheme: "gray" }
      case "destructive":
        return { variant: "solid", colorScheme: "red" }
      case "outline":
        return { variant: "outline", colorScheme: "gray" }
      default:
        return { variant: "solid", colorScheme }
    }
  }

  const chakraProps = getChakraProps(variant)

  return (
    <ChakraBadge {...chakraProps} fontSize="xs" fontWeight="semibold" {...props}>
      {children}
    </ChakraBadge>
  )
}

export { Badge }
