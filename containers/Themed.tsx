import { useThemes } from '@contexts/ThemesContext'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'

interface Props {
  children: React.ReactNode
}

const Themed = (props: Props) => {
  const { children } = props
  const { currentTheme } = useThemes()

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default Themed
