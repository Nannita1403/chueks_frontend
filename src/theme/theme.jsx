import { createSystem, defaultBaseConfig, defineConfig } from "@chakra-ui/react";
import { tabsTheme } from "./components/tabs";
import { buttonTheme } from "./components/button";
import { inputTheme } from "./components/inputs";

const themeSystem = defineConfig({
  colors: {
    brand: {
      50: "#e3f2ff",
      100: "#b3daff",
      200: "#81c2ff",
      300: "#4fa9ff",
      400: "#1d91ff",
      500: "#0477e6", // Color principal
      600: "#005fb4",
      700: "#004682",
      800: "#002e51",
      900: "#001620",
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
    Tabs: tabsTheme,
    Button: buttonTheme,
    Input: inputTheme,
  },
});
export const Theme = createSystem(defaultBaseConfig, themeSystem)
