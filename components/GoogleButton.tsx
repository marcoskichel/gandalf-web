import { Button, SxProps, Theme } from '@mui/material'
import Image from 'next/image'

interface Props {
  onClick?: () => void
  text: string
  sx?: SxProps<Theme>
}

const GoogleButton = (props: Props) => {
  const { onClick, text, sx } = props
  return (
    <Button
      sx={sx}
      onClick={onClick}
      fullWidth
      color="neutral"
      variant="contained"
      startIcon={
        <Image
          src="/icon__google.png"
          alt="Google Icon"
          width="24"
          height="24"
        ></Image>
      }
    >
      {text}
    </Button>
  )
}

export default GoogleButton
