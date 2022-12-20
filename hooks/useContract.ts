import { useMemo } from 'react'
import { AddressZero } from '@ethersproject/constants'
import { Provider } from '@ethersproject/providers'
import { ContractInterface } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { getContract } from '@services/contracts'

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
