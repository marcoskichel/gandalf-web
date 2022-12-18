import {
  SupportedContractInterface,
  SupportedContractInterfaceHelperTexts,
} from '@constants/SupportedContractInterfaces'
import { yupResolver } from '@hookform/resolvers/yup'
import ClearIcon from '@mui/icons-material/Clear'
import SaveIcon from '@mui/icons-material/Save'
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { TokenGateRequirement } from 'models/TokenGate'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { number, object, string, mixed } from 'yup'

interface Props {
  requirement?: TokenGateRequirement
  existingRequirements?: TokenGateRequirement[]
  onDelete?: (req: TokenGateRequirement) => void
  onAdd?: (req: TokenGateRequirement) => void
}

const onlyNumbers = /^[0-9\b]+$/

const TokenGateRequirementForm = (props: Props) => {
  const {
    requirement,
    existingRequirements = [],
    onDelete = () => {},
    onAdd = () => {},
  } = props

  const schema = object().shape({
    contractInterface: mixed()
      .required('Contract Interface is a required field')
      .oneOf(Object.values(SupportedContractInterface)),
    contractAddress: string()
      .required('Contract Address is a required field')
      .notOneOf(
        existingRequirements.map((req) => req.contractAddress),
        'Contract Address must be unique'
      ),
    amount: number()
      .typeError('Minumum Amount must be a number')
      .required('Minimum Amount is a required field'),
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<TokenGateRequirement>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (requirement) {
      Object.keys(requirement)
        .map((key) => key as keyof TokenGateRequirement)
        .forEach((key) => setValue(key, requirement[key]))
    }
  }, [requirement, setValue])

  const onSubmit = handleSubmit(async (data) => {
    onAdd(data)
    reset()
  })

  const handleDelete = () => {
    onDelete(requirement as TokenGateRequirement)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
      }}
    >
      <Controller
        name={'contractInterface'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl fullWidth error={Boolean(errors.contractInterface)}>
            <InputLabel id="token-gate-requirement-contract-interface-label">
              Contract Interface
            </InputLabel>
            <Select
              labelId="token-gate-requirement-contract-interface-label"
              id="token-gate-requirement-contract-interface"
              value={value || ''}
              label="Contract Interface"
              onChange={onChange}
            >
              {Object.values(SupportedContractInterface).map((erc) => {
                return (
                  <MenuItem key={erc} value={erc}>
                    {[
                      erc,
                      SupportedContractInterfaceHelperTexts[erc] || '',
                    ].join(' ')}
                  </MenuItem>
                )
              })}
            </Select>
            <FormHelperText>{errors.contractInterface?.message}</FormHelperText>
          </FormControl>
        )}
      />
      <Controller
        name={'contractAddress'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            onChange={onChange}
            value={value || ''}
            required
            fullWidth
            id="token-gate-requirement-contract-address-label"
            label="Contract Address"
            name="token-gate-requirement-contract-address"
            disabled={Boolean(requirement)}
            error={Boolean(errors.contractAddress)}
            helperText={errors.contractAddress?.message}
          />
        )}
      />
      <Controller
        name={'amount'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            onChange={(event) => {
              if (
                event.target.value === '' ||
                onlyNumbers.test(event.target.value)
              ) {
                onChange(event)
              }
            }}
            value={value || ''}
            required
            fullWidth
            id="token-gate-requirement-amount"
            label="Minimum Amount"
            name="token-gate-requirement-amount"
            disabled={Boolean(requirement)}
            error={Boolean(errors.amount)}
            helperText={errors.amount?.message}
          />
        )}
      />
      {requirement ? (
        <IconButton
          color="error"
          aria-label="add requirement"
          sx={{ width: 45, height: 45, mt: 1 }}
          onClick={handleDelete}
        >
          <ClearIcon />
        </IconButton>
      ) : (
        <IconButton
          color="primary"
          aria-label="add requirement"
          sx={{ width: 45, height: 45, mt: 1 }}
          onClick={onSubmit}
        >
          <SaveIcon />
        </IconButton>
      )}
    </Box>
  )
}

export default TokenGateRequirementForm
