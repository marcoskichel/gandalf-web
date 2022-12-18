import { ERC721Abi } from '@models/ERC721'
import { ContractInterface } from 'ethers'

export enum SupportedContractInterface {
  ERC721 = 'ERC721',
}

export const SupportedContractInterfaceAbis: Record<
  SupportedContractInterface,
  ContractInterface
> = {
  [SupportedContractInterface.ERC721]: ERC721Abi,
}

export const SupportedContractInterfaceHelperTexts: Record<
  SupportedContractInterface,
  string
> = {
  [SupportedContractInterface.ERC721]: '(Default for NFTs)',
}
