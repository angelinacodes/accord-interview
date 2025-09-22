"use client";

import { extendTheme } from "@chakra-ui/react";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";

const theme = extendTheme({
  fonts: {
    heading: "Outfit, sans-serif",
    body: "Outfit, sans-serif",
  },
  colors: {
    yellow: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "yellow",
      },
    },
    Badge: {
      defaultProps: {
        colorScheme: "yellow",
      },
    },
  },
});

export default theme;
