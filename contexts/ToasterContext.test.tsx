import { ToasterContextProvider, useToaster } from '@contexts/ToasterContext'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('ToasterContext', () => {
  const Component = () => {
    const { toast, setToast } = useToaster()

    return (
      <div>
        <span>{`${toast?.severity}-${toast?.message}`}</span>
        <button
          onClick={() => setToast({ severity: 'error', message: 'Test' })}
        >
          Add toast
        </button>
      </div>
    )
  }

  it('sets the toast', async () => {
    const user = userEvent.setup()
    render(
      <ToasterContextProvider>
        <Component />
      </ToasterContextProvider>
    )

    const btn = screen.getByRole('button')
    await user.click(btn)
    const toast = await screen.findByText('error-Test')
    expect(toast).toBeInTheDocument()
  })
})
