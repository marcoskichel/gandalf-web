import Themed from '@containers/Themed'
import Toaster from '@containers/Toaster'
import TokenGate from '@containers/TokenGate'
import { ToasterContextProvider } from '@contexts/ToasterContext'
import type { NextPage } from 'next'
import Head from 'next/head'

const Authorization: NextPage = () => {
  return (
    <Themed>
      <ToasterContextProvider>
        <Head>
          <title>BlueDome</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <TokenGate />
        <Toaster />
      </ToasterContextProvider>
    </Themed>
  )
}

export default Authorization
