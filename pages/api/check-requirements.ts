// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  MetTokenGateRequirement,
  TokenGateRequirement,
} from '@models/TokenGate'
import { SupportedContractInterfaceAbis } from 'enums/SupportedContractInterfaces'
import { BigNumber, ethers } from 'ethers'
import { URLS } from '@config/chains'
import { setCookie } from 'nookies'
import jwt from 'jsonwebtoken'

interface Props {
  gateId: string
  account: string
  chainId: number
  requirements: TokenGateRequirement[]
}

const checkSingleRequirement = async (
  account: string,
  provider: ethers.providers.JsonRpcProvider,
  requirement: TokenGateRequirement
): Promise<boolean> => {
  const abi = SupportedContractInterfaceAbis[requirement.contractInterface]
  const address = requirement.contractAddress
  const contract = new ethers.Contract(address, abi, provider)
  const balance = await contract.balanceOf(account)
  return balance.gte(BigNumber.from(requirement.amount))
}

const checkRequirements = async (
  account: string,
  chainId: number,
  requirements: TokenGateRequirement[]
): Promise<MetTokenGateRequirement[]> => {
  const [url] = URLS[chainId]
  const provider = new ethers.providers.JsonRpcProvider(url)
  return Promise.all(
    requirements.map(async (requirement) => {
      const met = await checkSingleRequirement(account, provider, requirement)
      return { ...requirement, met }
    })
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MetTokenGateRequirement[]>
) {
  if (req.method === 'POST') {
    const { account, chainId, gateId, requirements } = JSON.parse(
      req.body
    ) as Props

    const metRequirements = await checkRequirements(
      account,
      chainId,
      requirements
    )

    const allMet = metRequirements.every((requirement) => requirement.met)
    const token = jwt.sign(
      { account, gateId, requirements: metRequirements, allMet },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    )

    setCookie({ res }, 'token', token, {
      httpOnly: true,
      maxAge: 60 * 60,
      path: '/',
    })

    res.status(200).send(metRequirements)
  }
}
