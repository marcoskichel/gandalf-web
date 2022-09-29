import Navigation from '@containers/Navigation'
import Themed from '@containers/Themed'
import Toaster from '@containers/Toaster'
import { ToasterContextProvider } from '@contexts/ToasterContext'
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
        <Navigation title="Authorization" />
        <Container component="main" maxWidth="xs"></Container>
        <Toaster />
      </ToasterContextProvider>
    </Themed>
  )
}

export default Authorization
