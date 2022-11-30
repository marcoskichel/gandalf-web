import { Owned } from '@models/Owned'

export interface TokenGateRequirement {
  chainId: string
  contract: string
  amount: number
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
