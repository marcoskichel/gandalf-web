import { URLS } from '@config/chains'
import { ERC165Abi } from '@constants/abis'
import { SupportedContractInterface } from '@constants/SupportedContractInterfaces'
import { ethers, Contract, ContractInterface, Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'

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

  const ercs = await Promise.all([
    contract.supportsInterface(ERC1155InterfaceId),
    contract.supportsInterface(ERC721InterfaceId),
    contract.supportsInterface(ERC20InterfaceId),
  ])

  if (ercs[0]) return SupportedContractInterface.ERC1155
  if (ercs[1]) return SupportedContractInterface.ERC721
  if (ercs[2]) return SupportedContractInterface.ERC20

  throw new Error('Contract interface not supported')
}

export const getContract = <T = Contract>(
  address: string,
  abi: ContractInterface,
  provider: Signer | Provider
) => {
  return <T>(<unknown>new Contract(address, abi, provider))
}
