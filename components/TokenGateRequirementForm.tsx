import { SupportedContractInterface } from '@constants/SupportedContractInterfaces'
import { useToaster } from '@contexts/ToasterContext'
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
    reset,
    watch,
  } = useForm<TokenGateRequirement>({
    resolver: yupResolver(schema),
  })

  const { setToast } = useToaster()
  const contractAddress = watch('contractAddress')

  const [validating, setValidating] = useState(false)
  const [contractInterface, setContractInterface] =
    useState<SupportedContractInterface>()

  useEffect(() => {
    const loadContractDetails = async () => {
      setValidating(true)
      const exists = await contractExists(chainId, contractAddress)
      if (!exists) {
        setToast({
          message: 'Contract does not exist',
          severity: 'error',
        })
        setValidating(false)
        setValue('contractAddress', '')
        return
      }

      try {
        const interfaceValue = await getContractInterface(
          chainId,
          contractAddress
        )
        setContractInterface(interfaceValue)
      } catch (e) {
        const error = e as Error
        setToast({
          message: error.message,
          severity: 'error',
        })
        setValue('contractAddress', '')
      } finally {
        setValidating(false)
      }
    }

    const timer = setTimeout(() => {
      if (contractAddress?.length === 42) {
        loadContractDetails()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [chainId, contractAddress, setToast, setValue])

  useEffect(() => {
    if (requirement) {
      Object.keys(requirement)
        .map((key) => key as keyof TokenGateRequirement)
        .forEach((key) => setValue(key, requirement[key]))
    }
  }, [requirement, setValue])

  const onSubmit = handleSubmit(async (data) => {
    if (contractInterface) {
      onAdd({ ...data, contractInterface })
      reset()
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
            disabled={Boolean(requirement) || validating}
            error={Boolean(errors.contractAddress)}
            helperText={errors.contractAddress?.message}
            InputProps={{
              endAdornment: validating && !Boolean(requirement) && (
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
          disabled={validating}
        >
          <SaveIcon />
        </IconButton>
      )}
    </Box>
  )
}

export default TokenGateRequirementForm
