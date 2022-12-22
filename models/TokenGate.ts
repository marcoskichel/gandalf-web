import { SupportedContractInterface } from '@constants/SupportedContractInterfaces'
import { Owned } from '@models/Owned'

export interface TokenGateRequirement {
  contractAddress: string
  amount: number
  contractInterface: SupportedContractInterface
  met?: boolean
  contractName?: string
}

export interface TokenGate {
  name: string
  chainId: number
  description?: string | null
  requirements: TokenGateRequirement[]
  redirectUrl?: string | null
}

export type OwnedTokenGate = Owned<TokenGate>

export interface TokenGateAuthStatus {
  account: string
}

export type UserAuthStatus = Record<string, TokenGateAuthStatus>
