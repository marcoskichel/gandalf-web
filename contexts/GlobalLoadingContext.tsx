import { createContext, useContext, useMemo, useState } from 'react'

interface ContextProps {
  navigationLoading: boolean
  setNavigationLoading: (value: boolean) => void
}

const GlobalLoadingContext = createContext<ContextProps>({} as ContextProps)

interface ProviderProps {
  children: React.ReactNode
}

const GlobalLoadingContextProvider = (props: ProviderProps) => {
  const { children } = props

  const [navigationLoading, setNavigationLoading] = useState(false)

  const value = useMemo(
    () => ({
      navigationLoading,
      setNavigationLoading,
    }),
    [navigationLoading, setNavigationLoading]
  )

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
    </GlobalLoadingContext.Provider>
  )
}

const useGlobalLoading = () => useContext(GlobalLoadingContext)

export default GlobalLoadingContext
export { GlobalLoadingContextProvider, useGlobalLoading }
