import { Provider } from '@ethersproject/providers'
import { Contract, ContractInterface, Signer } from 'ethers'

export default function getContract<T = Contract>(
  address: string,
  abi: ContractInterface,
  provider: Signer | Provider
) {
  return <T>(<unknown>new Contract(address, abi, provider))
}
