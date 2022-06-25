import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
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
import { GuardRequirement } from '@types/Guard'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { number, object, SchemaOf, string } from 'yup'

const schema: SchemaOf<GuardRequirement> = object().shape({
  chainId: string().required('Chain is a required field'),
  contract: string().required('Contract Address is a required field'),
  amount: number().required('Minimum Amount is a required field'),
})

interface GuardFormProps {
  requirement?: GuardRequirement
  onDelete?: (req: GuardRequirement) => void
  onAdd?: (req: GuardRequirement) => void
}

const onlyNumbers = /^[0-9\b]+$/

const GuardRequirementForm = (props: GuardFormProps) => {
  const { requirement, onDelete = () => {}, onAdd = () => {} } = props

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<GuardRequirement>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (requirement) {
      Object.keys(requirement)
        .map((key) => key as keyof GuardRequirement)
        .forEach((key) => setValue(key, requirement[key]))
    }
  }, [requirement, setValue])

  const onSubmit = handleSubmit(async (data) => {
    onAdd(data)
    reset()
  })

  const handleDelete = () => {
    onDelete(requirement as GuardRequirement)
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
        name={'chainId'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl fullWidth error={Boolean(errors.chainId)}>
            <InputLabel id="guard-requirement-chain-label">Chain</InputLabel>
            <Select
              labelId="guard-requirement-chain-label"
              id="guard-requirement-chain"
              value={value || ''}
              label="Chain"
              onChange={onChange}
              disabled={Boolean(requirement)}
            >
              <MenuItem value="polygon">Polygon</MenuItem>
              <MenuItem value="solana">Solana</MenuItem>
            </Select>
            <FormHelperText>{errors.chainId?.message}</FormHelperText>
          </FormControl>
        )}
      />
      <Controller
        name={'contract'}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            onChange={onChange}
            value={value || ''}
            required
            fullWidth
            id="guard-requirement-contract-label"
            label="Contract Address"
            name="guard-requirement-contract"
            disabled={Boolean(requirement)}
            error={Boolean(errors.contract)}
            helperText={errors.contract?.message}
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
            id="guard-requirement-amount"
            label="Minimum Amount"
            name="guard-requirement-amount"
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
          <AddIcon />
        </IconButton>
      )}
    </Box>
  )
}

export default GuardRequirementForm
export { schema as guardRequirementSchema }
