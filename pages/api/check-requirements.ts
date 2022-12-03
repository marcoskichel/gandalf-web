// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { TokenGateRequirement } from '@models/TokenGate'
import { SupportedContractInterfaceAbis } from 'enums/SupportedContractInterfaces'
import { BigNumber, ethers } from 'ethers'
import { URLS } from '@config/chains'

type Data = {
  requirements: MetRequirement[]
}

interface Props {
  account: string
  chainId: number
  requirements: TokenGateRequirement[]
}

type MetRequirement = TokenGateRequirement & { met: boolean }

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
): Promise<MetRequirement[]> => {
  const [url] = URLS[chainId]
  console.log('URL', url)
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
  res: NextApiResponse<Data>
) {
  console.log(req.body)
  const { account, chainId, requirements } = JSON.parse(req.body) as Props
  console.log(chainId)
  const metRequirements = await checkRequirements(
    account,
    chainId,
    requirements
  )
  res.status(200).json({ requirements: metRequirements })
}
