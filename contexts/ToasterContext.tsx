import { createContext, useContext, useMemo, useState } from 'react'

interface Toast {
  severity?: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface ToasterContextProps {
  toast?: Toast
  setToast: (toast?: Toast) => void
}

const ToasterContext = createContext<ToasterContextProps>(
  {} as ToasterContextProps
)

interface ToastContextProviderProps {
  children: React.ReactNode
}

const ToasterContextProvider = (props: ToastContextProviderProps) => {
  const { children } = props
  const [toast, setToast] = useState<Toast>()

  const value = useMemo<ToasterContextProps>(
    () => ({
      toast,
      setToast,
    }),
    [toast]
  )

  return (
    <ToasterContext.Provider value={value}>{children}</ToasterContext.Provider>
  )
}

const useToaster = () => useContext(ToasterContext)

export default ToasterContext
export { ToasterContextProvider, useToaster }
