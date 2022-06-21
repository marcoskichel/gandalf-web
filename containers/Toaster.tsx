import { useToaster } from '@contexts/ToasterContext'
import {
  AlertProps,
  Alert as MuiAlert,
  Snackbar,
  Slide,
  SlideProps,
} from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'

const Toast = forwardRef<HTMLDivElement, AlertProps>(function Toast(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Transition = (props: SlideProps) => <Slide direction="up" {...props} />

interface Props {
  duration?: number
}

const Toaster = (props: Props) => {
  const { duration = 6000 } = props
  const { toast } = useToaster()

  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    if (toast) {
      setIsOpen(true)
    }
  }, [toast])

  return (
    <Snackbar
      TransitionComponent={Transition}
      open={isOpen}
      autoHideDuration={duration}
      onClose={handleClose}
    >
      <Toast
        onClose={handleClose}
        severity={toast?.severity}
        sx={{ width: '100%' }}
      >
        {toast?.message}
      </Toast>
    </Snackbar>
  )
}

export default Toaster
