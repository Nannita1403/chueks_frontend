
export const buttonTheme = {
  baseStyle: {
    borderRadius: "md",
    fontWeight: "semibold",
  },
  variants: {
    solid: (props) => ({
      bg: props.colorMode === "dark" ? "brand.400" : "brand.500",
      color: "white",
      _hover: {
        bg: props.colorMode === "dark" ? "brand.300" : "brand.600",
      },
    }),
  },
};
