import Themed from '@containers/Themed'
import Toaster from '@containers/Toaster'
import { ThemesContextProvider } from '@contexts/ThemesContext'
import ToasterContext from '@contexts/ToasterContext'
import { render, screen } from '@testing-library/react'

describe('Toaster', () => {
  const Component = () => {
    return (
      <ThemesContextProvider>
        <Themed>
          <Toaster />
        </Themed>
      </ThemesContextProvider>
    )
  }

  it('shows a toast', async () => {
    render(
      <ToasterContext.Provider
        value={{ setToast: jest.fn(), toast: { message: 'Toastest' } }}
      >
        <Component />
      </ToasterContext.Provider>
    )

    const toast = await screen.findByText('Toastest')
    expect(toast).toBeInTheDocument()
  })
})
