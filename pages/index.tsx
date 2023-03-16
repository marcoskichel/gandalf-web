import Navigation from '@containers/Navigation'
import Themed from '@containers/Themed'
import UserTokenGates from '@containers/UserTokenGates'
import { TokenGatesContextProvider } from '@contexts/TokenGatesContext'
import { Box } from '@mui/material'
import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { checkUserIsAuthorized } from '@services/authorization'
import { ToasterContextProvider } from '@contexts/ToasterContext'
import Toaster from '@containers/Toaster'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = await checkUserIsAuthorized(ctx)
  return {
    props: { token },
  }
}

const Home: NextPage = () => {
  return (
    <TokenGatesContextProvider>
      <Themed>
        <ToasterContextProvider>
          <Box>
            <Head>
              <title>BlueDome</title>
              <meta
                name="description"
                content="The home page of the gandalf website"
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navigation title="Home" />

            <Box component="main">
              <UserTokenGates />
            </Box>
          </Box>
          <Toaster />
        </ToasterContextProvider>
      </Themed>
    </TokenGatesContextProvider>
  )
}

export default Home
