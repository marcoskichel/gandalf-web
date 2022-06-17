import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { useThemes } from "../contexts/ThemesContext";

interface Props {
  children: React.ReactNode;
}

const Themed = (props: Props) => {
  const { children } = props;
  const { currentTheme } = useThemes();

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Themed;
