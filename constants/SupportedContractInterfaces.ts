import { ERC1155Abi, ERC20Abi, ERC721Abi } from '@constants/abis'
import { ContractInterface } from 'ethers'

export enum SupportedContractInterface {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  ERC20 = 'ERC20',
}

export const SupportedContractInterfaceAbis: Record<
  SupportedContractInterface,
  ContractInterface
> = {
  [SupportedContractInterface.ERC721]: ERC721Abi,
  [SupportedContractInterface.ERC1155]: ERC1155Abi,
  [SupportedContractInterface.ERC20]: ERC20Abi,
}

export const SupportedContractInterfaceHelperTexts: Record<
  SupportedContractInterface,
  string
> = {
  [SupportedContractInterface.ERC721]: '(Default for NFTs)',
  [SupportedContractInterface.ERC1155]: '(OpenSea, Rarible, etc.)',
  [SupportedContractInterface.ERC20]: '(Fungible tokens)',
}
