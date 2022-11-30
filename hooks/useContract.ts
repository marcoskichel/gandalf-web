import { useMemo } from 'react'

import { AddressZero } from '@ethersproject/constants'
import { Provider } from '@ethersproject/providers'
import { Contract, ContractInterface, Signer } from 'ethers'
import { isAddress } from 'ethers/lib/utils'

export function getContract<T = Contract>(
  address: string,
  abi: ContractInterface,
  provider: Signer | Provider
) {
  return <T>(<unknown>new Contract(address, abi, provider))
}

const useContract = <Contract = unknown>(
  provider: Provider,
  address: string,
  abi: ContractInterface
) => {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  const contract = useMemo(
    () => getContract<Contract>(address, abi, provider),
    [address, abi, provider]
  )

  return contract
}

export default useContract
