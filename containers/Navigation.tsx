import Routes from '@constants/routes'
import { useAuth } from '@contexts/AuthContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ExitIcon from '@mui/icons-material/ExitToApp'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  styled,
  IconButton,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Link {
  label: string
  path: string
}

interface NavItemProps {
  link: Link
}

const NavItem = (props: NavItemProps) => {
  const { link } = props
  const router = useRouter()

  return (
    <Button
      size="large"
      onClick={() => router.push(link.path)}
      sx={{ display: 'block', color: 'white' }}
    >
      {link.label}
    </Button>
  )
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

  const links: Link[] = [{ label: 'Home', path: Routes.home }]

  const handleSignOut = async () => {
    await signOut()
    router.push(Routes.signIn)
  }

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <StyledToolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2, visibility: { md: 'hidden' } }}
        >
          <MenuIcon />
        </IconButton>
        {user && links.map((link) => <NavItem key={link.label} link={link} />)}
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
