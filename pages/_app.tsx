import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../providers/auth";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
