import { Owned } from '@models/Owned'
import { SupportedContractInterface } from 'enums/SupportedContractInterfaces'
import { Contract } from 'ethers'

export interface TokenGateRequirement {
  contractAddress: string
  amount: number
  contractInterface: SupportedContractInterface
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
