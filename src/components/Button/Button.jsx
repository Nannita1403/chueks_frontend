import React from "react"
import { Button as ChakraButton } from "@chakra-ui/react"

const CustomButton = React.forwardRef(
  ({ variant = "solid", size = "md", colorScheme = "brand", children, ...props }, ref) => {
    const getChakraVariant = (variant) => {
      switch (variant) {
        case "default":
          return "solid"
        case "destructive":
          return "solid"
        case "outline":
          return "outline"
        case "secondary":
          return "solid"
        case "ghost":
          return "ghost"
        case "link":
          return "link"
        default:
          return "solid"
      }
    }

    const getChakraSize = (size) => {
      switch (size) {
        case "sm":
          return "sm"
        case "default":
          return "md"
        case "lg":
          return "lg"
        case "icon":
          return "sm"
        default:
          return "md"
      }
    }

    const getColorScheme = (variant) => {
      if (variant === "destructive") return "red"
      if (variant === "secondary") return "gray"
      return colorScheme
    }

    return (
      <ChakraButton
        ref={ref}
        variant={getChakraVariant(variant)}
        size={getChakraSize(size)}
        colorScheme={getColorScheme(variant)}
        {...props}
      >
        {children}
      </ChakraButton>
    )
  },
)

CustomButton.displayName = "CustomButton"

export { CustomButton }


/*import { Button } from "@chakra-ui/react"

const ButtonForm = ({
  children,
  width,
  type = "submit",
  onClick = () => {},
  invert,
}) => {
  return (
    <Button marginTop={'15px'} size="md" variant="outline" rounded="lg"
      onClick={onClick}
      className={`main_button ${invert ? "invert" : ""}`}
      style={{ width: width }}
      type={type}
    >
      {children}
    </Button>
  );
};

export default ButtonForm;*/