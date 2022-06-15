import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  AuthProvider,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { auth } from "../config/firebase";

interface AuthContextData {
  loading: boolean;
  signUpWithEmailAndPassoword: (
    email: string,
    password: string
  ) => Promise<void>;
  signInWithGoogleAccount: () => Promise<void>;
  signInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<void>;
  user?: User;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface Props {
  children: React.ReactNode;
}

const AuthContextProvider = (props: Props) => {
  const { children } = props;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [user, setUser] = useState<User>();

  // Update the user state when the user changes
  // Also sets initial loading to false after the first update
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user || undefined);
      setInitialLoading(false);
    });
  }, []);

  const signUpWithEmailAndPassoword = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        setUser(credentials.user);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signInWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const credentials = await firebaseSignInWithEmailAndPassword(
          auth,
          email,
          password
        );

        setUser(credentials.user);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signInWithProvider = useCallback(
    async (provider: AuthProvider, redirect = true) => {
      try {
        const result = redirect
          ? await signInWithRedirect(auth, provider)
          : await signInWithPopup(auth, provider);

        if (result.user) {
          setUser(result.user);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signInWithGoogleAccount = useCallback(
    async (redirect = true) => {
      const provider = new GoogleAuthProvider();
      return signInWithProvider(provider, redirect);
    },
    [signInWithProvider]
  );

  const value = useMemo(
    () => ({
      loading,
      user,
      signUpWithEmailAndPassoword,
      signInWithGoogleAccount,
      signInWithEmailAndPassword,
    }),
    [
      loading,
      user,
      signUpWithEmailAndPassoword,
      signInWithGoogleAccount,
      signInWithEmailAndPassword,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export default AuthContext;
export { useAuth, AuthContextProvider };
