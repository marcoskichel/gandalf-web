import { Button, Container, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'

const Paragraph = (props: { children: ReactNode }) => {
  const { children } = props
  return (
    <Typography
      variant="body1"
      textAlign="center"
      sx={{ lineHeight: '2rem', fontSize: '1.2rem', mt: '2rem' }}
    >
      {children}
    </Typography>
  )
}

const SiteMain = () => {
  return (
    <Container component="main" sx={{ mt: '6rem' }}>
      <Toolbar />
      <Typography variant="h2" textAlign="center">
        Protect Your Online Community with Tokenized Access
      </Typography>
      <Paragraph>
        BlueDome is a OAuth2 implementation that relies on user ownership of
        specific tokens in the blockchain to grant access to resources. This
        allows you to create a decentralized access control system for your
        online community.
      </Paragraph>
      <Box
        sx={{
          mt: '3rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button variant="outlined" size="large">
          Get started for free
        </Button>
      </Box>
    </Container>
  )
}

export default SiteMain
