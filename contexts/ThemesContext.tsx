import { Theme, createTheme } from '@mui/material'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

declare module '@mui/material' {
  interface Palette {
    neutral: Palette['primary']
    default: Palette['primary']
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary']
    default: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true
    default: true
  }
}

interface AppThemes {
  light: Theme
  dark: Theme
}

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
      light: '#9d46ff',
      dark: '#320b86',
    },
    neutral: {
      main: '#FFF',
      contrastText: '#616161',
    },
    default: {
      main: '#fff',
      contrastText: '#320b86',
    },
  },
})

const darkTheme = createTheme({
  shape: {
    borderRadius: 8,
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#303030',
      paper: '#424242',
    },
    primary: {
      main: '#6B68F1',
      light: '#D2C1FF',
      dark: '#4A4FD3',
    },
    neutral: {
      main: '#424242',
      contrastText: '#fff',
    },
    default: {
      main: '#303030',
      contrastText: '#fff',
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

const availableThemes = { light: lightTheme, dark: darkTheme }

interface Props {
  children: React.ReactNode
}

// TODO: Implement dark mode
const ThemesContextProvider = (props: Props) => {
  const { children } = props

  const [currentTheme, setCurrentTheme] = useState<Theme>(darkTheme)

  const switchTheme = useCallback((name: keyof AppThemes) => {
    setCurrentTheme(availableThemes[name])
  }, [])

  const value = useMemo(
    () => ({
      currentTheme,
      switchTheme,
    }),
    [currentTheme, switchTheme]
  )

  return (
    <ThemesContext.Provider value={value}>{children}</ThemesContext.Provider>
  )
}

const useThemes = () => useContext(ThemesContext)

export default ThemesContext
export { ThemesContextProvider, useThemes }
