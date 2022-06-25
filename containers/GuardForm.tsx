import GuardRequirementForm, {
  guardRequirementSchema,
} from '@components/GuardRequirementForm'
import { yupResolver } from '@hookform/resolvers/yup'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { Guard, GuardRequirement } from '@types/Guard'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { array, date, object, SchemaOf, string } from 'yup'

const schema: SchemaOf<Guard> = object().shape({
  name: string().required('Name is a required field'),
  description: string().optional(),
  startDateTime: date().optional(),
  endDateTime: date().optional(),
  requirements: array().of(guardRequirementSchema),
})

const GuardForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<Guard>({
    resolver: yupResolver(schema),
  })

  const helpers: Partial<Record<keyof Guard, string>> = {
    startDateTime: 'Empty means it starts imediatelly',
    endDateTime: 'Empty means it never expires',
  }

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
  })

  const [now] = useState(new Date())

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
              id="guard-name"
              label="Name"
              name="guard-name"
              autoFocus
              error={Boolean(errors.name)}
              helperText={errors.name?.message || helpers.name}
            />
          )}
        />
        <Controller
          name={'description'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              onChange={onChange}
              value={value || ''}
              fullWidth
              id="guard-description"
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
            const reqs: GuardRequirement[] = value || []
            return (
              <>
                {reqs.map((req) => (
                  <GuardRequirementForm
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
                <GuardRequirementForm
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
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                minDateTime={now}
                renderInput={(props) => (
                  <TextField
                    fullWidth
                    id="guard-start-date"
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
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                minDateTime={now}
                renderInput={(props) => (
                  <TextField
                    fullWidth
                    id="guard-start-date"
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
            Save Guard
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default GuardForm
