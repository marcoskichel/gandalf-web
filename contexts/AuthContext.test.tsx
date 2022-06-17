import { useAuth } from '@contexts/AuthContext'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockCreateUserWithUserNameAndPassword = jest.fn()
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: () => mockCreateUserWithUserNameAndPassword,
}))

describe('AuthContextProvider', () => {
  const Component = () => {
    const { signUpWithEmailAndPassoword } = useAuth()
    return (
      <div>
        <button
          onClick={() =>
            signUpWithEmailAndPassoword('user@test.com', 'test123')
          }
        >
          Sign Up
        </button>
      </div>
    )
  }

  describe('signUpWithEmailAndPassoword', () => {
    it('', () => {
      const user = userEvent.setup()
      render(<Component />)

      const btn = screen.getByRole('button')
      user.click(btn)
      expect(mockCreateUserWithUserNameAndPassword).toHaveBeenCalledTimes(1)
    })
  })
})
