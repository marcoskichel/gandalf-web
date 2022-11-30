import Routes from '@constants/routes'
import Navigation from '@containers/Navigation'
import Themed from '@containers/Themed'
import Toaster from '@containers/Toaster'
import TokenGateForm from '@containers/TokenGateForm'
import { ToasterContextProvider } from '@contexts/ToasterContext'
import { TokenGatesContextProvider } from '@contexts/TokenGatesContext'
import { checkUserIsAuthorized } from '@helpers/authorization'
import { Box } from '@mui/material'
import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = await checkUserIsAuthorized(ctx)
  return {
    props: { token },
  }
}

const ComposeTokenGate: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <Themed>
      <TokenGatesContextProvider>
        <ToasterContextProvider>
          <Box>
            <Head>
              <title>Gandalf - Compose Token Gate</title>
              <meta name="description" content="Generated by create next app" />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navigation title="New Token Gate" backPath={Routes.home} />

            <Box component="main">
              <TokenGateForm id={id as string} />
            </Box>
          </Box>
          <Toaster />
        </ToasterContextProvider>
      </TokenGatesContextProvider>
    </Themed>
  )
}

export default ComposeTokenGate