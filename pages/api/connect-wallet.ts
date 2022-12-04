import {
  LoadedTokenGateRequirement,
  TokenGateRequirement,
} from '@models/TokenGate'
import type { NextApiRequest, NextApiResponse } from 'next'
import { checkGateRequirements } from '@services/token-gate'
import {
  findTokenGateAuthStatus,
  setTokenGateAuthStatus,
} from '@services/token-gate-auth-status'
import jwt from 'jsonwebtoken'
import { setCookie } from 'nookies'

interface Props {
  gateId: string
  account: string
  chainId: number
  requirements: TokenGateRequirement[]
}

type TokenPayload = Record<string, string>

const TOKEN_COOKIE = 'user-token'

const getTokenPayload = (token: string): TokenPayload => {
  if (token) {
    const existingToken = jwt.decode(token) as jwt.JwtPayload
    return existingToken?.status as TokenPayload
  }
  return {}
}

const getStatus = async (
  payload: TokenPayload,
  gateId: string,
  account: string
) => {
  const existingStatus = payload[gateId]
    ? await findTokenGateAuthStatus(payload[gateId])
    : null

  const accounts = existingStatus?.data()?.accounts || []
  const status = {
    accounts: new Set([...Array.from(accounts), account]),
  }
  return setTokenGateAuthStatus(status)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoadedTokenGateRequirement[]>
) {
  if (req.method === 'POST') {
    const { account, gateId, requirements } = JSON.parse(req.body) as Props

    const loadedGate = await checkGateRequirements(
      account,
      gateId,
      requirements
    )

    const payload = getTokenPayload(req.cookies[TOKEN_COOKIE])
    const status = await getStatus(payload, gateId, account)

    const updatedPayload = {
      ...payload,
      [gateId]: status.id,
    }

    const token = jwt.sign(updatedPayload, process.env.JWT_SECRET as string, {
      expiresIn: '4h',
    })

    setCookie({ res }, TOKEN_COOKIE, token, {
      httpOnly: true,
      maxAge: 60 * 60 * 4,
      path: '/',
    })

    res.status(200).send(metRequirements)
  }
}
