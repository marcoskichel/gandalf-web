import { capitalizeFirstLetter } from '@helpers/text'
import { DecoratedTokenGateRequirement } from '@models/TokenGate'
import { Checkbox, FormControlLabel } from '@mui/material'
import { toWords } from 'number-to-words'
interface Props {
  requirement: DecoratedTokenGateRequirement
}

const Requirement = (props: Props) => {
  const { requirement } = props

  const isPlural = requirement.amount > 1
  const label = `${capitalizeFirstLetter(toWords(requirement.amount))} item${
    isPlural ? 's' : ''
  } of the "${requirement?.contractName}" collection.`

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
