import {defaultBaseConfig, defineConfig, extendTheme } from "@chakra-ui/react";

const themeSystem = defineConfig({
  colors: {
    brand: {
      0:"#ff0080",// Color magenta
      1:"#00e6e6",// Color cyan
      2: "#ffff00",// Color amarillo
      3: "#7cfc00",// Color verde
      4: "#9370db",// Color violeta
      50: "#ffffff", //Color Blanco
      100: "#f6f6f6",// Color gris claro bg      
      200: "#e2e2e2",// Color gris claro bgButton-border
      300: "#9d9d9d",// Color gris oscuro letra-borderselected
      400: "#595959",// Color gris oscuro bgFondo 
      500:"#000000",// Color negro
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
    lg: "20px",
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
export const Theme = extendTheme(defaultBaseConfig, themeSystem)
