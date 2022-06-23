import Navigation from '@containers/Navigation'
import Themed from '@containers/Themed'
import UserGuards from '@containers/UserGuards'
import { checkUserIsAuthorized } from '@helpers/authorization'
import { Box } from '@mui/material'
import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = await checkUserIsAuthorized(ctx)
  return {
    props: { token },
  }
}

const Home: NextPage = () => {
  return (
    <Themed>
      <Box>
        <Head>
          <title>Gandalf</title>
          <meta
            name="description"
            content="The home page of the gandalf website"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navigation title="Home" />

        <Box component="main">
          <UserGuards />
        </Box>
      </Box>
    </Themed>
  )
}

export default Home
