import { createTheme, Theme } from '@mui/material'
import { createContext, useCallback, useContext, useState } from 'react'

declare module '@mui/material' {
  interface Palette {
    neutral: Palette['primary']
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true
  }
}

interface AppThemes {
  light: Theme
  dark: Theme
}

const lightTheme = createTheme({
  palette: {
    neutral: {
      main: '#FFF',
      contrastText: '#616161',
    },
  },
})

interface ContextData {
  currentTheme: Theme
  switchTheme: (name: keyof AppThemes) => void
}

const ThemesContext = createContext<ContextData>({
  currentTheme: lightTheme,
  switchTheme: () => {},
})

const availableThemes = { light: lightTheme, dark: lightTheme }

interface Props {
  children: React.ReactNode
}

// TODO: Implement dark mode
const ThemesContextProvider = (props: Props) => {
  const { children } = props

  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme)

  const switchTheme = useCallback((name: keyof AppThemes) => {
    setCurrentTheme(availableThemes[name])
  }, [])

  return (
    <ThemesContext.Provider
      value={{
        currentTheme,
        switchTheme,
      }}
    >
      {children}
    </ThemesContext.Provider>
  )
}

const useThemes = () => useContext(ThemesContext)

export default ThemesContext
export { ThemesContextProvider, useThemes }
