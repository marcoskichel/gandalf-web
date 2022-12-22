import { yupResolver } from '@hookform/resolvers/yup'
import ClearIcon from '@mui/icons-material/Clear'
import SaveIcon from '@mui/icons-material/Save'
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import { contractExists, getContractInterface } from '@services/contracts'
import { TokenGateRequirement } from 'models/TokenGate'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { number, object, string } from 'yup'

interface Props {
  chainId: number
  requirement?: TokenGateRequirement
  existingRequirements?: TokenGateRequirement[]
  onDelete?: (req: TokenGateRequirement) => void
  onAdd?: (req: TokenGateRequirement) => void
}

const onlyNumbers = /^[0-9\b]+$/

const TokenGateRequirementForm = (props: Props) => {
  const {
    chainId,
    requirement,
    existingRequirements = [],
    onDelete = () => {},
    onAdd = () => {},
  } = props

  const schema = object().shape({
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
    setError,
    reset,
  } = useForm<TokenGateRequirement>({
    resolver: yupResolver(schema),
  })

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (requirement) {
      Object.keys(requirement)
        .map((key) => key as keyof TokenGateRequirement)
        .forEach((key) => setValue(key, requirement[key]))
    }
  }, [requirement, setValue])

  const onSubmit = handleSubmit(async (data) => {
    const contractAddress = data.contractAddress
    if (contractAddress.length !== 42 || !contractAddress.startsWith('0x')) {
      setError('contractAddress', {
        type: 'custom',
        message: 'Invalid contract address',
      })
      return
    }

    setSubmitting(true)
    const exists = await contractExists(chainId, contractAddress)
    if (!exists) {
      setError('contractAddress', {
        type: 'custom',
        message: 'Contract address does not exist',
      })
      setSubmitting(false)
      return
    }

    try {
      const interfaceValue = await getContractInterface(
        chainId,
        contractAddress
      )
      if (interfaceValue) {
        onAdd({ ...data, contractInterface: interfaceValue })
        reset()
      }
      setSubmitting(false)
    } catch (e) {
      const error = e as Error
      setSubmitting(false)
      setError('contractAddress', {
        type: 'custom',
        message: error.message,
      })
    }
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
            disabled={Boolean(requirement) || submitting}
            error={Boolean(errors.contractAddress)}
            helperText={errors.contractAddress?.message}
            InputProps={{
              endAdornment: submitting && !Boolean(requirement) && (
                <InputAdornment position="end">
                  <CircularProgress />
                </InputAdornment>
              ),
            }}
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
          disabled={submitting}
        >
          <SaveIcon />
        </IconButton>
      )}
    </Box>
  )
}

export default TokenGateRequirementForm
