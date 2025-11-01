import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { lightTheme, darkTheme } from "../theme.config.js";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider
        defaultTheme="dark"
        themes={{
          light: lightTheme,
          dark: darkTheme,
        }}
      >
        <main className="text-foreground bg-background">
          <App />
        </main>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);
