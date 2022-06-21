import { AuthContextProvider, useAuth } from '@contexts/AuthContext'
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('firebase/app')
jest.mock('firebase/auth')
jest.mock('firebase/firestore')

describe('AuthContextProvider', () => {
  describe('signUpWithEmailAndPassword', () => {
    const Component = () => {
      const { signUpWithEmailAndPassword, user, loading } = useAuth()
      return (
        <div>
          <span>{loading && 'Loading...'}</span>
          <span>{user && 'User logged in'}</span>
          <button
            onClick={() =>
              signUpWithEmailAndPassword('user@test.com', 'test123')
            }
          >
            Sign Up
          </button>
        </div>
      )
    }

    it('sign the user up and automatically sign in', async () => {
      const user = userEvent.setup()
      render(
        <AuthContextProvider>
          <Component />
        </AuthContextProvider>
      )

      const btn = screen.getByRole('button')
      user.click(btn)
      const loading = await screen.findByText('Loading...')
      const userLoggedIn = await screen.findByText('User logged in')
      expect(loading).toBeInTheDocument()
      expect(userLoggedIn).toBeInTheDocument()
    })

    it('resets loading afterwards', async () => {
      const user = userEvent.setup()
      render(
        <AuthContextProvider>
          <Component />
        </AuthContextProvider>
      )

      const btn = screen.getByRole('button')
      user.click(btn)
      const loading = await screen.findByText('Loading...')
      waitForElementToBeRemoved(loading)
    })
  })

  describe('signInWithEmailAndPassoword', () => {
    const Component = () => {
      const { signInWithEmailAndPassword, user, loading } = useAuth()
      return (
        <div>
          <span>{loading && 'Loading...'}</span>
          <span>{user && 'User logged in'}</span>
          <button
            onClick={() =>
              signInWithEmailAndPassword('user@test.com', 'test123')
            }
          >
            Sign In
          </button>
        </div>
      )
    }

    it('sign the user in', async () => {
      const user = userEvent.setup()
      render(
        <AuthContextProvider>
          <Component />
        </AuthContextProvider>
      )

      const btn = screen.getByRole('button')
      user.click(btn)
      const loading = await screen.findByText('Loading...')
      const userLoggedIn = await screen.findByText('User logged in')
      expect(loading).toBeInTheDocument()
      expect(userLoggedIn).toBeInTheDocument()
    })

    it('resets loading afterwards', async () => {
      const user = userEvent.setup()
      render(
        <AuthContextProvider>
          <Component />
        </AuthContextProvider>
      )

      const btn = screen.getByRole('button')
      user.click(btn)
      const loading = await screen.findByText('Loading...')
      waitForElementToBeRemoved(loading)
    })
  })

  describe('signInWithGoogleAccount', () => {
    const Component = () => {
      const { signInWithGoogleAccount, user, loading } = useAuth()
      return (
        <div>
          <span>{loading && 'Loading...'}</span>
          <span>{user && 'User logged in'}</span>
          <button onClick={() => signInWithGoogleAccount()}>Sign In</button>
        </div>
      )
    }

    it('sign the user in', async () => {
      const user = userEvent.setup()
      render(
        <AuthContextProvider>
          <Component />
        </AuthContextProvider>
      )

      const btn = screen.getByRole('button')
      user.click(btn)
      const loading = await screen.findByText('Loading...')
      const userLoggedIn = await screen.findByText('User logged in')
      expect(loading).toBeInTheDocument()
      expect(userLoggedIn).toBeInTheDocument()
    })

    it('resets loading afterwards', async () => {
      const user = userEvent.setup()
      render(
        <AuthContextProvider>
          <Component />
        </AuthContextProvider>
      )

      const btn = screen.getByRole('button')
      user.click(btn)
      const loading = await screen.findByText('Loading...')
      waitForElementToBeRemoved(loading)
    })
  })
})
