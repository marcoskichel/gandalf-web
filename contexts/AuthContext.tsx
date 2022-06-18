import { auth } from '@config/firebase'
import {
  AuthProvider,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onIdTokenChanged,
  signInWithPopup,
} from 'firebase/auth'
import nookies from 'nookies'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface AuthContextData {
  loading: boolean
  signUpWithEmailAndPassoword: (
    email: string,
    password: string
  ) => Promise<void>
  signInWithGoogleAccount: () => Promise<void>
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  user: User | null
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface Props {
  children: React.ReactNode
}

const AuthContextProvider = (props: Props) => {
  const { children } = props

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Update the user state when the user token changes
  useEffect(() => {
    onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken()
        setUser(user)
        nookies.set(undefined, 'token', token, { path: '/' })
      } else {
        setUser(null)
        nookies.set(undefined, 'token', '', { path: '/' })
      }
    })
  }, [])

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser
      if (user) {
        await user.getIdToken(true)
      }
    }, 10 * 60 * 1000)

    return () => clearInterval(handle)
  }, [])

  const signUpWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      try {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

        setUser(credentials.user)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const signInWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        const credentials = await firebaseSignInWithEmailAndPassword(
          auth,
          email,
          password
        )

        setUser(credentials.user)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const signInWithProvider = useCallback(async (provider: AuthProvider) => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, provider)
      if (result.user) {
        setUser(result.user)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const signInWithGoogleAccount = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    return signInWithProvider(provider)
  }, [signInWithProvider])

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth)
    await user?.getIdToken()
  }, [user])

  const value = useMemo(
    () => ({
      loading,
      user,
      signUpWithEmailAndPassoword: signUpWithEmailAndPassword,
      signInWithGoogleAccount,
      signInWithEmailAndPassword,
      signOut,
    }),
    [
      loading,
      user,
      signUpWithEmailAndPassword,
      signInWithGoogleAccount,
      signInWithEmailAndPassword,
      signOut,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export default AuthContext
export { useAuth, AuthContextProvider }
