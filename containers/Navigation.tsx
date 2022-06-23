import Routes from '@constants/routes'
import { useAuth } from '@contexts/AuthContext'
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'
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
      onClick={() => router.push(link.path)}
      sx={{ display: 'block', color: 'white' }}
    >
      {link.label}
    </Button>
  )
}

interface Props {
  title?: string
}

const Navigation = (props: Props) => {
  const { title } = props

  const { user } = useAuth()
  const router = useRouter()

  const showSignInButton = !user && router.pathname !== Routes.signIn

  const links: Link[] = [{ label: 'Home', path: Routes.home }].filter(
    (link) => link.path !== router.pathname
  )

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex' } }}>
          {title && <Typography variant="h6">{title}</Typography>}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {user &&
              links.map((link) => <NavItem key={link.label} link={link} />)}
          </Box>
        </Box>
        <Box>{showSignInButton && <Button color="inherit">Login</Button>}</Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
