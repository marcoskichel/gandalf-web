import { hooks as metamaskHooks } from '@config/connectors/metamask'
import { capitalizeFirstLetter } from '@helpers/text'
import { DecoratedTokenGateRequirement } from '@models/TokenGate'
import { Checkbox, FormControlLabel } from '@mui/material'
import { toWords } from 'number-to-words'
import { useEffect, useState } from 'react'

const { useAccount } = metamaskHooks
interface Props {
  requirement: DecoratedTokenGateRequirement
}

interface State {
  loading: boolean
  contractName?: string
}

const Requirement = (props: Props) => {
  const { requirement } = props

  const account = useAccount()

  const [state, setState] = useState<State>({ loading: true })

  useEffect(() => {
    const updateState = async () => {
      const { contract } = requirement
      const contractName = await contract.name()

      setState((prev) => ({ ...prev, contractName, loading: false }))
    }
    updateState()
  }, [account, requirement])

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
          checked={requirement.met}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      }
    />
  )
}

export default Requirement
