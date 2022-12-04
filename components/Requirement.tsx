import { capitalizeFirstLetter } from '@helpers/text'
import { LoadedTokenGateRequirement } from '@models/TokenGate'
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
} from '@mui/material'
import { toWords } from 'number-to-words'
interface Props {
  requirement: LoadedTokenGateRequirement
  isLoading: boolean
}

const Requirement = (props: Props) => {
  const { requirement, isLoading } = props

  const isPlural = requirement.amount > 1
  const label = `${capitalizeFirstLetter(toWords(requirement.amount))} item${
    isPlural ? 's' : ''
  } of the "${requirement?.contractName}" collection.`

  return (
    <FormControlLabel
      label={label}
      sx={{ cursor: 'default' }}
      control={
        isLoading ? (
          <Box
            sx={{
              height: 46,
              width: 46,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress size="24px" />
          </Box>
        ) : (
          <Checkbox
            disableRipple
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 }, cursor: 'default' }}
            checked={requirement.met}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        )
      }
    />
  )
}

export default Requirement
