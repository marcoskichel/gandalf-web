import { URLS } from '@config/chains'
import { ERC165Abi } from '@constants/abis'
import { SupportedContractInterface } from '@constants/SupportedContractInterfaces'
import { ethers } from 'ethers'

const ERC1155InterfaceId = '0xd9b67a26'
const ERC721InterfaceId = '0x80ac58cd'
const ERC20InterfaceId = '0x36372b07'

export const contractExists = async (
  chainId: number,
  address: string
): Promise<boolean> => {
  const [url] = URLS[chainId]
  const provider = new ethers.providers.JsonRpcProvider(url)
  const code = await provider.getCode(address)

  return code !== '0x'
}

export const getContractInterface = async (
  chainId: number,
  address: string
): Promise<SupportedContractInterface> => {
  const [url] = URLS[chainId]
  const provider = new ethers.providers.JsonRpcProvider(url)
  const contract = new ethers.Contract(address, ERC165Abi, provider)

  if (await contract.supportsInterface(ERC1155InterfaceId)) {
    return SupportedContractInterface.ERC1155
  }

  if (await contract.supportsInterface(ERC721InterfaceId)) {
    return SupportedContractInterface.ERC721
  }

  if (await contract.supportsInterface(ERC20InterfaceId)) {
    return SupportedContractInterface.ERC20
  }

  throw new Error('Contract interface not supported')
}
