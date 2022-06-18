import GoogleButton from '@components/GoogleButton'
import Themed from '@containers/Themed'
import { ThemesContextProvider } from '@contexts/ThemesContext'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('GoogleButton', () => {
  it('renders', () => {
    const { asFragment } = render(
      <ThemesContextProvider>
        <Themed>
          <GoogleButton text="Sign in with Google" sx={{ mb: 1 }} />
        </Themed>
      </ThemesContextProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('triggers onClick callback', async () => {
    const onClick = jest.fn()
    const user = userEvent.setup()

    render(
      <ThemesContextProvider>
        <Themed>
          <GoogleButton text="Sign in with Google" onClick={onClick} />
        </Themed>
      </ThemesContextProvider>
    )

    const btn = screen.getByRole('button')
    await user.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
