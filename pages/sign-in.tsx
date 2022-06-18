import SignInForm from '@containers/SignInForm'
import Themed from '@containers/Themed'
import Toaster from '@containers/Toaster'
import { ToasterContextProvider } from '@contexts/ToasterContext'
import { checkUserIsNotAuthorized } from '@helpers/authorization'
import { Container } from '@mui/material'
import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  await checkUserIsNotAuthorized(ctx)
  return { props: {} }
}

const SignIn: NextPage = () => {
  return (
    <Themed>
      <ToasterContextProvider>
        <Head>
          <title>Gandalf</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container component="main" maxWidth="xs">
          <SignInForm />
        </Container>
        <Toaster />
      </ToasterContextProvider>
    </Themed>
  )
}

export default SignIn
