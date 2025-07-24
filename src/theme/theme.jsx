import { extendTheme } from "@chakra-ui/react";

export const themeSystem = extendTheme({
  colors: {
    brand: {
     brand: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899", // fuchsia-500
      600: "#db2777", // fuchsia-600
      700: "#be185d", // fuchsia-700
      800: "#9d174d", // fuchsia-800
      900: "#831843",
    },
    cyan: {
      500: "#0BC5EA",
    },
    yellow: {
      400: "#F6E05E",
    },
  },
    background: "#f7fafc",
    text: "#1a202c",
    muted: "#718096",
    error: "#e53e3e",
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Fira Code', monospace",
  },
  fontSizes: {
    sm: "14px",
    md: "16px",
    lg: "24px",
  },
  radii: {
    base: "8px",
    md: "12px",
    xl: "24px",
  },
  components: {
    Tabs: {
  baseStyle: {
    tab: {
      _selected: {
        color: "brand.0",
        borderBottom: "2px solid",
        borderColor: "brand.0",
      }}},
  variants: {
    enclosed: {
      tab: {
        _selected: {
          bg: "brand.0",
          color: "brand.50",
        }}}},
  },
    Button: {
  baseStyle: {
    borderRadius: "md",
    fontWeight: "semibold",
    font: "mono", 
  },
  variants: {
    solid: (props) => ({
      bg: props.colorMode === "dark" ? "brand.500" : "brand.200",
      color: "white",
      _hover: {
        bg: props.colorMode === "dark" ? "brand.200" : "brand.500",
      },
    })}
  },
    Input: {
    baseStyle: {
    font: "mono", 
  },
  variants: {
    outline: {
      field: {
        borderColor: "gray.100",
        _focus: {
          borderColor: "brand.0",
          boxShadow: "0 0 0 1px var(--chakra-colors-brand-0)",
    }}}}
  },
},
});
