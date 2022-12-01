import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

interface CheckListContextProps {
  checklist: Record<string, boolean>
  set: (key: string, value: boolean) => void
  setChecklist: (checklist: Record<string, boolean>) => void
}

const CheckListContext = createContext<CheckListContextProps>(
  {} as CheckListContextProps
)

interface CheckListContextProviderProps {
  children: React.ReactNode
}

const CheckListContextProvider = (props: CheckListContextProviderProps) => {
  const { children } = props
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})

  const set = useCallback((key: string, value: boolean) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const value = useMemo<CheckListContextProps>(
    () => ({
      checklist,
      set,
      setChecklist,
    }),
    [checklist, set]
  )

  return (
    <CheckListContext.Provider value={value}>
      {children}
    </CheckListContext.Provider>
  )
}

const useCheckList = () => useContext(CheckListContext)

export default CheckListContext
export { CheckListContextProvider, useCheckList }
