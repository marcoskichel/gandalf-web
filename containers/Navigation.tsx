import Routes from '@constants/routes'
import { useAuth } from '@contexts/AuthContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ExitIcon from '@mui/icons-material/ExitToApp'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  styled,
  IconButton,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Link {
  label: string
  path: string
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'flex-start',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    minHeight: 128,
  },
}))

interface Props {
  title: string
  backPath?: string
}

const Navigation = (props: Props) => {
  const { title, backPath } = props

  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push(Routes.signIn)
  }

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <StyledToolbar>
        <Box
          sx={{
            flexGrow: 1,
            alignSelf: 'flex-end',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {backPath && (
            <Link href={backPath}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="back button"
                sx={{ mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Link>
          )}
          <Typography noWrap variant="h5">
            {title}
          </Typography>
        </Box>
        <IconButton size="large" aria-label="settings" color="inherit">
          <SettingsIcon />
        </IconButton>
        {user && (
          <IconButton
            onClick={handleSignOut}
            size="large"
            aria-label="sign out"
            edge="end"
            color="inherit"
          >
            <ExitIcon />
          </IconButton>
        )}
      </StyledToolbar>
    </AppBar>
  )
}

export default Navigation
