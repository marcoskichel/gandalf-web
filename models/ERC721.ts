import { BigNumber } from 'ethers'

export interface ERC721 {
  name: () => Promise<string>
  symbol: () => Promise<string>
  balanceOf: (owner: string) => Promise<BigNumber>
}
