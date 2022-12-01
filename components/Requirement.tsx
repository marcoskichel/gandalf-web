import { hooks as networkHooks } from '@config/connectors/network'
import { hooks as metamaskHooks } from '@config/connectors/metamask'
import { useCheckList } from '@contexts/ChecklistContext'
import { Provider } from '@ethersproject/providers'
import { Checkbox, FormControlLabel } from '@mui/material'
import { BigNumber } from 'ethers'
import useContract from 'hooks/useContract'
import { toWords } from 'number-to-words'
import { useEffect, useState } from 'react'

const { useProvider } = networkHooks
const { useAccount } = metamaskHooks
interface Props {
  requirement: { contract: string; amount: number }
  met: boolean
}

interface ERC721 {
  name: () => Promise<string>
  symbol: () => Promise<string>
  balanceOf: (owner: string) => Promise<BigNumber>
}

const abi = [
  'function name() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  // 'function symbol() view returns (string)',
]

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

interface State {
  loading: boolean
  contractName: string
}

const Requirement = (props: Props) => {
  const { requirement, met } = props

  const provider = useProvider()
  const account = useAccount()
  const { set } = useCheckList()

  const contract = useContract<ERC721>(
    provider as Provider,
    requirement.contract,
    abi
  )

  const [state, setState] = useState<State>({ loading: true, contractName: '' })

  useEffect(() => {
    const updateState = async () => {
      if (contract) {
        const contractName = await contract.name()
        setState((old) => ({ ...old, contractName, loading: false }))

        if (account) {
          const balance = await contract.balanceOf(account)
          const met = balance.gte(BigNumber.from(requirement.amount))
          set(requirement.contract, met)
        }
      }
    }
    updateState()
  }, [account, contract, requirement, set])

  if (state.loading) {
    return null
  }

  const isPlural = requirement.amount > 1
  const label = `${capitalizeFirstLetter(toWords(requirement.amount))} item${
    isPlural ? 's' : ''
  } of the "${state?.contractName}" collection.`

  return (
    <FormControlLabel
      label={label}
      control={
        <Checkbox
          disableRipple
          sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
          checked={met}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      }
    />
  )
}

export default Requirement
