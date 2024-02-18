import GoogleButton from '@components/GoogleButton'
import Routes from '@constants/routes'
import { useAuth } from '@contexts/AuthContext'
import { useGlobalLoading } from '@contexts/GlobalLoadingContext'
import { useToaster } from '@contexts/ToasterContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from '@mui/material'
import { FirebaseError } from 'firebase-admin'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { SchemaOf, object, string } from 'yup'

interface FormData {
  email: string
  password: string
}

const schema: SchemaOf<FormData> = object().shape({
  email: string()
    .email('Must be an email address')
    .required('Email Address is a required field'),
  password: string().required('Password is a required field'),
})

const SignInForm = () => {
  const { signInWithEmailAndPassword, signInWithGoogleAccount } = useAuth()
  const router = useRouter()
  const { setToast } = useToaster()
  const { setNavigationLoading } = useGlobalLoading()

  const { handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const signIn = async (
    delegate: (username: string, password: string) => Promise<void>,
    data?: FormData
  ) => {
    try {
      setNavigationLoading(true)
      await delegate(data?.email as string, data?.password as string)
      router.push(Routes.home)
    } catch (error) {
      const fbError = error as FirebaseError
      if (
        fbError.code === 'auth/user-not-found' ||
        fbError.code === 'auth/wrong-password'
      ) {
        setToast({
          message: 'Invalid credentials, please try again.',
          severity: 'error',
        })
      } else {
        throw error
      }
    } finally {
      setNavigationLoading(false)
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    await signIn(signInWithEmailAndPassword, data)
  })

  const onGoogleSignIn = async () => {
    await signIn(signInWithGoogleAccount)
  }

  return (
    <Box
      data-testid="sign-in-form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box component="form" onSubmit={onSubmit} noValidate>
        <GoogleButton
          sx={{ mb: 2 }}
          onClick={onGoogleSignIn}
          text="Sign In with Google"
        />
      </Box>
    </Box>
  )
}

export default SignInForm
