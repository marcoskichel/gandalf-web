import { AuthContextProvider } from '@contexts/AuthContext'
import { GlobalLoadingContextProvider } from '@contexts/GlobalLoadingContext'
import { ThemesContextProvider } from '@contexts/ThemesContext'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemesContextProvider>
        <AuthContextProvider>
          <GlobalLoadingContextProvider>
            <Component {...pageProps} />
          </GlobalLoadingContextProvider>
        </AuthContextProvider>
      </ThemesContextProvider>
    </LocalizationProvider>
  )
}

export default MyApp
