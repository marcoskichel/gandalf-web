import { TokenGateRequirement as Requirement } from '@models/TokenGate'
import useContract from 'hooks/useContract'

interface Props {
  requirement: Requirement
}

const abi = [
  'function name() public view returns (string)',
  'function totalSupply() public view returns (uint256)',
]

interface ERC721 {
  name: string
}

const TokenGateRequirement = (props: Props) => {
  const { requirement } = props

  const contract = useContract<ERC721>(requirement.contract, abi)
  console.log(contract.name)

  return (
    <div>
      <p>Name: {contract.name}</p>
    </div>
  )
}

export default TokenGateRequirement
