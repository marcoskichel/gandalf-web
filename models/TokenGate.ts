import { Owned } from '@models/Owned'
import { Contract } from 'ethers'

export interface TokenGateRequirement {
  chainId: string
  contractAddress: string
  amount: number
}

export type DecoratedTokenGateRequirement = TokenGateRequirement & {
  contract: Contract
  contractName: string
  met: boolean
}

export interface TokenGate {
  name: string
  chainId: number
  description?: string | null
  startDateTime?: Date | null
  endDateTime?: Date | null
  requirements: TokenGateRequirement[]
}

export type OwnedTokenGate = Owned<TokenGate>
