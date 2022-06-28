import { AppCollections } from '@config/firebase'
import { useAuth } from '@contexts/AuthContext'
import { withOwner } from '@models/Owned'
import { OwnedTokenGate, TokenGate } from '@models/TokenGate'
import {
  addDoc,
  deleteDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  QuerySnapshot,
  setDoc,
  where,
} from 'firebase/firestore'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react'

interface ContextProps {
  findTokenGate: (id: string) => Promise<DocumentSnapshot<OwnedTokenGate>>
  fetchTokenGates: (
    ...extraConstraints: QueryConstraint[]
  ) => Promise<QuerySnapshot<OwnedTokenGate>>
  addTokenGate: (data: TokenGate) => Promise<DocumentReference<OwnedTokenGate>>
  updateTokenGate: (id: string, data: TokenGate) => Promise<void>
  removeTokenGate: (id: string) => Promise<void>
}

const TokenGatesContext = createContext<ContextProps>({} as ContextProps)

interface ProviderProps {
  children: ReactNode
}

const TokenGatesContextProvider = (props: ProviderProps) => {
  const { children } = props

  const { user } = useAuth()

  const findTokenGate = useCallback(
    (id: string): Promise<DocumentSnapshot<OwnedTokenGate>> => {
      const ref = doc(AppCollections.tokenGates, id)
      return getDoc(ref)
    },
    []
  )

  const fetchTokenGates = useCallback(
    async (
      ...extraConstraints: QueryConstraint[]
    ): Promise<QuerySnapshot<OwnedTokenGate>> => {
      const q = query(
        AppCollections.tokenGates,
        where('ownerId', '==', user?.uid),
        ...extraConstraints
      )
      return getDocs<OwnedTokenGate>(q)
    },
    [user?.uid]
  )

  const addTokenGate = useCallback(
    (data: TokenGate): Promise<DocumentReference<OwnedTokenGate>> => {
      return addDoc<OwnedTokenGate>(
        AppCollections.tokenGates,
        withOwner<TokenGate>(data, user?.uid as string)
      )
    },
    [user?.uid]
  )

  const updateTokenGate = useCallback(
    (id: string, data: TokenGate): Promise<void> => {
      const ref = doc(AppCollections.tokenGates, id)
      return setDoc<OwnedTokenGate>(
        ref,
        withOwner<TokenGate>(data, user?.uid as string)
      )
    },
    [user?.uid]
  )

  const removeTokenGate = useCallback((id: string): Promise<void> => {
    const ref = doc(AppCollections.tokenGates, id)
    return deleteDoc(ref)
  }, [])

  const value = useMemo(
    () => ({
      findTokenGate,
      fetchTokenGates,
      addTokenGate,
      updateTokenGate,
      removeTokenGate,
    }),
    [
      addTokenGate,
      fetchTokenGates,
      findTokenGate,
      removeTokenGate,
      updateTokenGate,
    ]
  )

  return (
    <TokenGatesContext.Provider value={value}>
      {children}
    </TokenGatesContext.Provider>
  )
}

const useTokenGates = () => useContext(TokenGatesContext)

export default TokenGatesContext
export { TokenGatesContextProvider, useTokenGates }
