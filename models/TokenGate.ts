export interface TokenGateRequirement {
  chainId: string
  contract: string
  amount: number
}

export interface TokenGate {
  name: string
  description?: string
  startDateTime?: Date
  endDateTime?: Date
  requirements: TokenGateRequirement[]
}
