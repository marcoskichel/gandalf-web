import type { AppProps } from "next/app";
import { AuthContextProvider } from "../contexts/AuthContext";
import "../styles/globals.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemesContextProvider } from "../contexts/ThemesContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemesContextProvider>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </ThemesContextProvider>
  );
}

export default MyApp;
