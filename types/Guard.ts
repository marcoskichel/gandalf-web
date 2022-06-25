export interface GuardRequirement {
  chainId: string
  contract: string
  amount: number
}

export interface Guard {
  name: string
  description?: string
  startDateTime?: Date
  endDateTime?: Date
  requirements: GuardRequirement[]
}
