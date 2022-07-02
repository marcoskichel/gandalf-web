import Routes from '@constants/routes'
import { useAuth } from '@contexts/AuthContext'
import { useGlobalLoading } from '@contexts/GlobalLoadingContext'
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
  LinearProgress,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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

const StyledLinearProgress = styled(LinearProgress)(() => ({
  width: '100%',
}))

interface Props {
  title: string
  backPath?: string
}

const Navigation = (props: Props) => {
  const { title, backPath } = props

  const { user, signOut } = useAuth()
  const { navigationLoading, setNavigationLoading } = useGlobalLoading()
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        setNavigationLoading(true)
      }
    }

    const handleComplete = () => {
      setNavigationLoading(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

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
      <StyledLinearProgress
        sx={{ visibility: navigationLoading ? 'visible' : 'hidden' }}
      />
    </AppBar>
  )
}

export default Navigation
