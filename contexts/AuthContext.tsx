import {
  AuthProvider,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { useRouter } from "next/router";
import nookies from "nookies";
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
  signOut: () => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface Props {
  children: React.ReactNode;
}

const AuthContextProvider = (props: Props) => {
  const { children } = props;

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Update the user state when the user token changes
  useEffect(() => {
    onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, "token", token, { path: "/" });
      } else {
        setUser(null);
        nookies.set(undefined, "token", "", { path: "/" });
        router.push("/sign-in");
      }
    });
    // The router object trigger is not memoize and cause multiple re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.getIdToken(true);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(handle);
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

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    await user?.getIdToken();
  }, [user]);

  const value = useMemo(
    () => ({
      loading,
      user,
      signUpWithEmailAndPassoword,
      signInWithGoogleAccount,
      signInWithEmailAndPassword,
      signOut,
    }),
    [
      loading,
      user,
      signUpWithEmailAndPassoword,
      signInWithGoogleAccount,
      signInWithEmailAndPassword,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export default AuthContext;
export { useAuth, AuthContextProvider };
