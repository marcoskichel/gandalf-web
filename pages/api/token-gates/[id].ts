import { TokenGate, TokenGateRequirement } from '@models/TokenGate'
import { loadGate } from '@services/token-gate'
import {
  findTokenGateAuthStatus,
  setTokenGateAuthStatus,
} from '@services/token-gate-auth-status'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import { destroyCookie, setCookie } from 'nookies'

interface Props {
  gateId: string
  account: string
  chainId: number
  requirements: TokenGateRequirement[]
}

type TokenPayload = Record<string, string>

const TOKEN_COOKIE = 'user-token'

const getTokenPayload = (req: NextApiRequest): TokenPayload => {
  const token = req.cookies[TOKEN_COOKIE]
  if (token) {
    const existingToken = jwt.decode(token) as jwt.JwtPayload
    return existingToken as TokenPayload
  }
  return {}
}

const isTokenValid = (req: NextApiRequest): boolean => {
  try {
    const token = req.cookies[TOKEN_COOKIE]
    jwt.verify(token, process.env.JWT_SECRET as string)
    return true
  } catch (error) {
    return false
  }
}

const checkAccountAgainstRequirements = async (
  req: NextApiRequest,
  res: NextApiResponse<TokenGate | { message: string } | void>
): Promise<void> => {
  const { id: gateId } = req.query as { id: string }
  const { account } = JSON.parse(req.body) as Props
  const gate = await loadGate(gateId, account)

  if (gate) {
    const payload = isTokenValid(req) ? getTokenPayload(req) : {}
    const statusDoc = await setTokenGateAuthStatus({ account })

    const updatedPayload = {
      ...payload,
      [gateId]: statusDoc.id,
    }

    const token = jwt.sign(updatedPayload, process.env.JWT_SECRET as string, {
      expiresIn: '4h',
    })

    setCookie({ res }, TOKEN_COOKIE, token, {
      httpOnly: true,
      maxAge: 60 * 60 * 4,
      path: '/',
    })

    return res.status(200).send(gate)
  }

  return res.status(404).send({ message: 'Token gate not found.' })
}

const retrieveGate = async (
  req: NextApiRequest,
  res: NextApiResponse<TokenGate | { message: string } | void>
): Promise<void> => {
  const { id: gateId } = req.query as { id: string }
  const validToken = isTokenValid(req)
  const payload = validToken ? getTokenPayload(req) : {}

  if (!validToken) {
    destroyCookie({ res }, TOKEN_COOKIE, {
      httpOnly: true,
      maxAge: 60 * 60 * 4,
      path: '/',
    })
  }

  const status = payload[gateId]
    ? await findTokenGateAuthStatus(payload[gateId])
    : null

  const gate = await loadGate(gateId, status?.data()?.account)
  if (gate) {
    return res.status(200).send(gate)
  }

  return res.status(404).send({ message: 'Token gate not found.' })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenGate | { message: string } | void>
) {
  if (req.method === 'POST') {
    await checkAccountAgainstRequirements(req, res)
  } else if (req.method === 'GET') {
    await retrieveGate(req, res)
  }
}
