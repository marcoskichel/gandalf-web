import TokenGateRequirementForm from '@components/TokenGateRequirementForm'
import Routes from '@constants/routes'
import { useToaster } from '@contexts/ToasterContext'
import { useTokenGates } from '@contexts/TokenGatesContext'
import { getDateError } from '@helpers/validations'
import { yupResolver } from '@hookform/resolvers/yup'
import { TokenGate, TokenGateRequirement } from '@models/TokenGate'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { array, date, object, SchemaOf, string, number } from 'yup'

const schema: SchemaOf<TokenGate> = object().shape({
  name: string().required('Name is a required field'),
  description: string().nullable(),
  startDateTime: date().nullable(),
  endDateTime: date().nullable(),
  requirements: array()
    .required('Atleast one requirement is required')
    .of(
      object().shape({
        chainId: string().required(),
        contract: string().required(),
        amount: number().required(),
      })
    ),
})

const TokenGateForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<TokenGate>({
    resolver: yupResolver(schema),
  })

  const { addTokenGate } = useTokenGates()
  const { setToast } = useToaster()
  const router = useRouter()

  const [now] = useState(new Date())

  const helpers: Partial<Record<keyof TokenGate, string>> = {
    startDateTime: 'Empty means it starts imediatelly',
    endDateTime: 'Empty means it never expires',
  }

  const onSubmit = handleSubmit(
    async (data) => {
      await addTokenGate(data)
      router.push(Routes.home)
    },
    (formErrors) => {
      if (formErrors?.requirements) {
        const error = formErrors.requirements as unknown as FieldError
        setToast({
          message: error.message as string,
          severity: 'error',
        })
      }
    }
  )

  return (
    <Container>
      <Box
        component="form"
        onSubmit={onSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h5">General Information</Typography>
        <Controller
          name={'name'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              onChange={onChange}
              value={value || ''}
              required
              fullWidth
              id="token-gate-name"
              label="Name"
              name="token-gate-name"
              autoFocus
              error={Boolean(errors.name)}
              helperText={errors.name?.message || helpers.name}
            />
          )}
        />
        <Controller
          name={'description'}
          control={control}
          defaultValue={null}
          render={({ field: { onChange, value } }) => (
            <TextField
              onChange={onChange}
              value={value || ''}
              fullWidth
              id="token-gate-description"
              label="Description"
              name="description"
              error={Boolean(errors.description)}
              helperText={errors.description?.message || helpers.description}
            />
          )}
        />

        <Typography variant="h5">Requirements</Typography>
        <Controller
          name={'requirements'}
          control={control}
          render={({ field: { onChange, value } }) => {
            const reqs: TokenGateRequirement[] = value || []
            return (
              <>
                {reqs.map((req) => (
                  <TokenGateRequirementForm
                    key={req.contract}
                    requirement={req}
                    onDelete={(deleted) => {
                      setValue(
                        'requirements',
                        value.filter(
                          (item) => item.contract !== deleted.contract
                        )
                      )
                    }}
                  />
                ))}
                <TokenGateRequirementForm
                  existingRequirements={reqs}
                  onAdd={(req) => {
                    onChange([...reqs, req])
                  }}
                />
              </>
            )
          }}
        />

        <Typography variant="h5">Time Constraints</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          }}
        >
          <Controller
            name={'startDateTime'}
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                onAccept={() => clearErrors('startDateTime')}
                onError={(reason) =>
                  setError(
                    'startDateTime',
                    getDateError(reason as string, 'Start Date')
                  )
                }
                minDateTime={now}
                renderInput={(props) => (
                  <TextField
                    fullWidth
                    id="token-gate-start-date"
                    name="start-date-time"
                    error={Boolean(errors.startDateTime)}
                    helperText={
                      errors.startDateTime?.message || helpers.startDateTime
                    }
                    {...props}
                  />
                )}
                onChange={onChange}
                value={value || null}
                label="Start Date"
              />
            )}
          />
          <Controller
            name={'endDateTime'}
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                minDateTime={now}
                onAccept={() => clearErrors('endDateTime')}
                onError={(reason) =>
                  setError(
                    'endDateTime',
                    getDateError(reason as string, 'End Date')
                  )
                }
                renderInput={(props) => (
                  <TextField
                    fullWidth
                    id="token-gate-start-date"
                    name="start-date-time"
                    error={Boolean(errors.endDateTime)}
                    helperText={
                      errors.endDateTime?.message || helpers.endDateTime
                    }
                    {...props}
                  />
                )}
                onChange={onChange}
                value={value || null}
                label="End Date"
              />
            )}
          />
        </Box>

        <Box sx={{ ml: 'auto' }}>
          <Button
            type="submit"
            size="large"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save Token Gate
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default TokenGateForm
