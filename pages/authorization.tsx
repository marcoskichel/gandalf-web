import Navigation from '@containers/Navigation'
import Themed from '@containers/Themed'
import Toaster from '@containers/Toaster'
import TokenGate from '@containers/TokenGate'
import { ToasterContextProvider } from '@contexts/ToasterContext'
import { TokenGateAuthStatusContextProvider } from '@contexts/TokenGateAuthStatusContext'
import { TokenGatesContextProvider } from '@contexts/TokenGatesContext'
import { Container } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'

const Authorization: NextPage = () => {
  return (
    <Themed>
      <ToasterContextProvider>
        <Head>
          <title>Gandalf</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navigation title="Halt!" />
        <Container component="main" maxWidth="xs">
          <TokenGatesContextProvider>
            <TokenGateAuthStatusContextProvider>
              <TokenGate gateId="s8oomR9x2JDC4nohNxD3" />
            </TokenGateAuthStatusContextProvider>
          </TokenGatesContextProvider>
        </Container>
        <Toaster />
      </ToasterContextProvider>
    </Themed>
  )
}

export default Authorization
