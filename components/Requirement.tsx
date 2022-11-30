import { useEffect, useState } from 'react'
import { Provider } from '@ethersproject/providers'
import { hooks } from '@config/connectors/network'
import useContract from 'hooks/useContract'
import { BigNumber } from 'ethers'

const { useProvider } = hooks

interface Props {
  requirement: { contract: string; amount: number }
}

interface ERC721 {
  name: () => Promise<string>
  symbol: () => Promise<string>
  balanceOf: (owner: string) => Promise<BigNumber>
}

const abi = [
  'function name() view returns (string)',
  // 'function symbol() view returns (string)',
  // 'function balanceOf(address) view returns (uint256)',
]

const Requirement = (props: Props) => {
  const { requirement } = props

  const provider = useProvider()

  const contract = useContract<ERC721>(
    provider as Provider,
    requirement.contract,
    abi
  )

  const [name, setName] = useState<string>()

  useEffect(() => {
    const loadContractMetadata = async () => {
      if (contract) {
        setName(await contract.name())
      }
    }
    loadContractMetadata()
  }, [contract])

  return (
    <div>
      <p>{name}</p>
      <p>At least: {requirement.amount}</p>
    </div>
  )
}

export default Requirement
