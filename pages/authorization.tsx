import Navigation from '@containers/Navigation'
import Themed from '@containers/Themed'
import Toaster from '@containers/Toaster'
import TokenGate from '@containers/TokenGate'
import { ToasterContextProvider } from '@contexts/ToasterContext'
import { TokenGatesContextProvider } from '@contexts/TokenGatesContext'
import {
  Web3Provider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from '@ethersproject/providers'
import { Container } from '@mui/material'
import { Web3ReactProvider } from '@web3-react/core'
import type { NextPage } from 'next'
import Head from 'next/head'

const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) => {
  return new Web3Provider(provider)
}

const Authorization: NextPage = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Themed>
        <ToasterContextProvider>
          <Head>
            <title>Gandalf</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Navigation title="Authorization" />
          <Container component="main" maxWidth="xs">
            <TokenGatesContextProvider>
              <TokenGate gateId="s8oomR9x2JDC4nohNxD3" />
            </TokenGatesContextProvider>
          </Container>
          <Toaster />
        </ToasterContextProvider>
      </Themed>
    </Web3ReactProvider>
  )
}

export default Authorization
