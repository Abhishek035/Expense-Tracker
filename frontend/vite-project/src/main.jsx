import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  fontFamily: "Inter Tight, sans-serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "600",
  },

  colors: {
    // Define your custom color palette
    primary: [
      "#e6f9fb",
      "#ccf2f6",
      "#99e6ed",
      "#66d9e4",
      "#33cddb",
      "#0090A0", // Your primary color at index 5 (default)
      "#007a87",
      "#00656e",
      "#004f55",
      "#003a3c",
    ],
  },

  primaryColor: "primary",

  other: {
    // Store your custom CSS variables for easy access
    background1: "var(--color-background1)",
    background2: "var(--color-background2)",
  },

  breakpoints: {
    xs: "36em",
    sm: "40em",
    md: "48em",
    lg: "64em",
    xl: "80em",
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>
);
