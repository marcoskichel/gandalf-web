import Routes from '@constants/routes'
import SignInForm from '@containers/SignInForm'
import Themed from '@containers/Themed'
import AuthContext from '@contexts/AuthContext'
import { GlobalLoadingContextProvider } from '@contexts/GlobalLoadingContext'
import { ThemesContextProvider } from '@contexts/ThemesContext'
import ToasterContext from '@contexts/ToasterContext'
import { fireEvent, render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
import { act } from 'react-dom/test-utils'

jest.mock('firebase/app')
jest.mock('firebase/auth')
jest.mock('firebase/firestore')
jest.mock('next/router')

describe('SignInForm', () => {
  it('renders', () => {
    const { asFragment } = render(
      <GlobalLoadingContextProvider>
        <ThemesContextProvider>
          <Themed>
            <SignInForm />
          </Themed>
        </ThemesContextProvider>
      </GlobalLoadingContextProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  describe('Inline validations', () => {
    it('validate email is required', async () => {
      render(
        <GlobalLoadingContextProvider>
          <ThemesContextProvider>
            <Themed>
              <SignInForm />
            </Themed>
          </ThemesContextProvider>
        </GlobalLoadingContextProvider>
      )
      const passwordInput = screen.getByTestId('password-input')
      const btn = screen.getByText('Sign In')

      fireEvent.change(passwordInput, { target: { value: 'password' } })
      await act(() => {
        fireEvent.click(btn)
      })

      const error = screen.getByText('Email Address is a required field')
      expect(error).toBeInTheDocument()
    })

    it('validate email is correctly formatted', async () => {
      render(
        <GlobalLoadingContextProvider>
          <ThemesContextProvider>
            <Themed>
              <SignInForm />
            </Themed>
          </ThemesContextProvider>
        </GlobalLoadingContextProvider>
      )

      const emailInput = screen.getByRole('textbox', { name: 'Email Address' })
      const btn = screen.getByText('Sign In')

      fireEvent.change(emailInput, { target: { value: 'test' } })
      await act(() => {
        fireEvent.click(btn)
      })

      const error = screen.getByText('Must be an email address')
      expect(error).toBeInTheDocument()
    })

    it('validate password is required', async () => {
      render(
        <GlobalLoadingContextProvider>
          <ThemesContextProvider>
            <Themed>
              <SignInForm />
            </Themed>
          </ThemesContextProvider>
        </GlobalLoadingContextProvider>
      )
      const emailInput = screen.getByRole('textbox', { name: 'Email Address' })
      const btn = screen.getByText('Sign In')

      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      await act(() => {
        fireEvent.click(btn)
      })

      const error = await screen.findByText('Password is a required field')
      expect(error).toBeInTheDocument()
    })
  })

  describe('Email and Password Authentication', () => {
    const setToast = jest.fn()
    const auth = {
      user: null,
      signOut: jest.fn(),
      loading: false,
      signUpWithEmailAndPassword: jest.fn(),
      signInWithGoogleAccount: jest.fn(),
      signInWithEmailAndPassword: jest.fn(),
    }

    const signIn = async () => {
      render(
        <GlobalLoadingContextProvider>
          <AuthContext.Provider value={auth}>
            <ToasterContext.Provider value={{ setToast }}>
              <ThemesContextProvider>
                <Themed>
                  <SignInForm />
                </Themed>
              </ThemesContextProvider>
            </ToasterContext.Provider>
          </AuthContext.Provider>
        </GlobalLoadingContextProvider>
      )

      const emailInput = screen.getByRole('textbox', { name: 'Email Address' })
      const passwordInput = screen.getByTestId('password-input')
      const btn = screen.getByText('Sign In')

      fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password' } })
      await act(() => {
        fireEvent.click(btn)
      })
    }

    it('shows an error toast when using wrong username', async () => {
      auth.signInWithEmailAndPassword.mockRejectedValueOnce({
        code: 'auth/user-not-found',
      })

      await signIn()
      expect(setToast).toHaveBeenCalledWith({
        message: 'Invalid credentials, please try again.',
        severity: 'error',
      })
    })

    it('shows an error toast when using wrong password', async () => {
      auth.signInWithEmailAndPassword.mockRejectedValueOnce({
        code: 'auth/wrong-password',
      })

      await signIn()
      expect(setToast).toHaveBeenCalledWith({
        message: 'Invalid credentials, please try again.',
        severity: 'error',
      })
    })

    it('redirects authorized users to the Home page', async () => {
      const router = useRouter()
      const mockPush = router.push as jest.Mock

      await signIn()
      expect(mockPush).toHaveBeenCalledWith(Routes.home)
    })
  })
})
