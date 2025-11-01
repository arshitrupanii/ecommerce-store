import { createTheme } from "@heroui/react";

export const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {
      primary: "bg-emerald-800",
      secondary: "",
      background: "#ffffff",
      foreground: "#000000",
    },
  },
});

export const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      primary: "#0070f3",
      secondary: "#7828C8",
      background: "#000000",
      foreground: "#ffffff",
    },
  },
});
