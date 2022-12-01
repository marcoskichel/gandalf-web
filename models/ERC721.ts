import { BigNumber } from 'ethers'

export interface ERC721 {
  name: () => Promise<string>
  symbol: () => Promise<string>
  balanceOf: (owner: string) => Promise<BigNumber>
}

const ERC721Abi = [
  'function name() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)',
]

export { ERC721Abi }
