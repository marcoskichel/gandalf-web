import Routes from '@constants/routes'
import AddIcon from '@mui/icons-material/Add'
import { Container, Typography, Fab } from '@mui/material'
import Link from 'next/link'

const UserTokenGates = () => {
  return (
    <Container sx={{ position: 'relative' }}>
      <Typography variant="h4">Token Gates</Typography>
      <Link href={Routes.tokenGateForm}>
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'absolute', bottom: 2, right: 2 }}
        >
          <AddIcon />
        </Fab>
      </Link>
    </Container>
  )
}

export default UserTokenGates
