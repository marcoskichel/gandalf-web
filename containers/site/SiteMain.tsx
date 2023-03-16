import { Button, Container, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'

const SiteMain = () => {
  return (
    <Container component="main" sx={{ mt: '6rem' }}>
      <Toolbar />
      <Typography variant="h2" textAlign="center">
        Protect Your Online Community with Tokenized Access
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        sx={{ lineHeight: '2rem', fontSize: '1.2rem', mt: '2rem' }}
      >
        Protect your online community with token gates that control access based
        on ownership of specific tokens. With our tool, you can easily create
        and manage token gates for your Discord server, Slack, or any other
        online application that supports OAuth2.
      </Typography>
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
