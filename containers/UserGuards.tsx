import Routes from '@constants/routes'
import AddIcon from '@mui/icons-material/Add'
import { Container, Typography, Fab } from '@mui/material'
import Link from 'next/link'

const UserGuards = () => {
  return (
    <Container sx={{ position: 'relative' }}>
      <Typography variant="h4">Guards</Typography>
      <Link href={Routes.guardForm}>
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

export default UserGuards
