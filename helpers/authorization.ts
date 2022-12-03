import firebaseAdmin from '@config/firebaseAdmin'
import Routes from '@constants/routes'
import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'

const checkUserIsAuthorized = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx)
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token)

    return token
  } catch (err) {
    // console.error(err)
    ctx.res.writeHead(302, { Location: Routes.signIn })
    ctx.res.end()
    return null
  }
}

const checkUserIsNotAuthorized = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx)
    await firebaseAdmin.auth().verifyIdToken(cookies.token)
    ctx.res.writeHead(302, { Location: Routes.home })
    ctx.res.end()

    return null
  } catch (err) {
    return null
  }
}

export { checkUserIsAuthorized, checkUserIsNotAuthorized }
