import GoogleButton from '@components/GoogleButton'
import { useAuth } from '@contexts/AuthContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material'
import { FirebaseError } from 'firebase-admin'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { SchemaOf, object, string } from 'yup'

interface FormData {
  email: string
  password: string
}

const schema: SchemaOf<FormData> = object().shape({
  email: string().email('Required field').required('Must be a password'),
  password: string().required('Required field'),
})

const SignInForm = () => {
  const { signInWithEmailAndPassword, signInWithGoogleAccount } = useAuth()
  const router = useRouter()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const signIn = async (
    delegate: (username: string, password: string) => Promise<void>,
    data?: FormData
  ) => {
    try {
      await delegate(data?.email as string, data?.password as string)
      router.push('/')
    } catch (error) {
      const fbError = error as FirebaseError
      if (
        fbError.code === 'auth/user-not-found' ||
        fbError.code === 'auth/wrong-password'
      ) {
        alert('invalid user')
      }
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
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <Controller
          name={'email'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              onChange={onChange}
              value={value || ''}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
          )}
        />
        <Controller
          name={'password'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              onChange={onChange}
              value={value || ''}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
          )}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Sign In
        </Button>
        <Box sx={{ m: 1 }}>
          <Typography textAlign="center" variant="body2">
            OR
          </Typography>
        </Box>
        <GoogleButton
          sx={{ mb: 2 }}
          onClick={onGoogleSignIn}
          text="Sign In with Google"
        />
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default SignInForm
