"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SessionProvider } from "next-auth/react";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0a3d5c", light: "#14618a", dark: "#06121f", contrastText: "#fff" },
    secondary: { main: "#f36f21", light: "#f7941d", dark: "#c45112", contrastText: "#fff" },
    success: { main: "#7cbf2c" },
    info: { main: "#00aeef" },
    warning: { main: "#f7941d" },
    error: { main: "#d32f2f" },
    background: { default: "#eef7fc", paper: "#ffffff" },
    text: { primary: "#06121f", secondary: "#3a5568" },
  },
  typography: {
    fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
    allVariants: {
      fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
    },
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 780, letterSpacing: "-0.02em" },
    h3: { fontWeight: 720, letterSpacing: "-0.02em" },
    h4: {
      fontWeight: 700,
      "@media (max-width:600px)": { fontSize: "1.5rem" },
    },
    h5: {
      fontWeight: 700,
      "@media (max-width:600px)": { fontSize: "1.2rem" },
    },
    h6: { fontWeight: 680 },
    button: { textTransform: "none", fontWeight: 650 },
  },
  shape: { borderRadius: 12 },
  breakpoints: {
    values: { xs: 0, sm: 480, md: 768, lg: 1024, xl: 1280 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "none",
          ":hover": { boxShadow: "none" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          WebkitTapHighlightColor: "transparent",
        },
        body: {
          fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
        },
        "*": {
          fontFamily: 'inherit',
        },
      },
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
