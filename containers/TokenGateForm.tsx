import TokenGateRequirementForm from '@components/TokenGateRequirementForm'
import { SUPPORTED_CHAINS } from '@config/chains'
import Routes from '@constants/routes'
import { SupportedContractInterface } from '@constants/SupportedContractInterfaces'
import { useGlobalLoading } from '@contexts/GlobalLoadingContext'
import { useToaster } from '@contexts/ToasterContext'
import { useTokenGates } from '@contexts/TokenGatesContext'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  OwnedTokenGate,
  TokenGate,
  TokenGateRequirement,
} from '@models/TokenGate'
import SaveIcon from '@mui/icons-material/Save'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { array, bool, mixed, number, object, SchemaOf, string } from 'yup'

const schema: SchemaOf<TokenGate> = object().shape({
  name: string().required('Name is a required field'),
  chainId: number().required('Chain is a required field'),
  description: string().nullable(),
  redirectUrl: string().nullable(),
  requirements: array()
    .required('Please save at least one requirement first')
    .min(1, 'Please save at least one requirement first')
    .of(
      object().shape({
        contractAddress: string().required(),
        contractInterface: mixed()
          .oneOf(Object.values(SupportedContractInterface))
          .required(),
        amount: number().required(),
        met: bool(),
        contractName: string(),
      })
    ),
})

interface Props {
  id?: string
}

const TokenGateForm = (props: Props) => {
  const { id } = props

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm<TokenGate>({
    defaultValues: {
      chainId: Object.keys(SUPPORTED_CHAINS).map(Number)[0],
    },
    resolver: yupResolver(schema),
  })

  const { addTokenGate, findTokenGate, updateTokenGate } = useTokenGates()
  const { setToast } = useToaster()
  const { setNavigationLoading } = useGlobalLoading()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const chainId = watch('chainId')

  const helpers: Partial<Record<keyof TokenGate, string>> = {}

  useEffect(() => {
    const loadTokenGate = async () => {
      setLoading(true)
      if (id) {
        const doc = await findTokenGate(id)
        if (!doc.exists()) {
          router.push('/not-found')
        }

        const gate = doc.data() as OwnedTokenGate
        Object.keys(gate)
          .map((key) => key as keyof TokenGate)
          .forEach((key) => setValue(key, gate[key] || null))
      }
      setLoading(false)
    }
    loadTokenGate()
  }, [findTokenGate, id, router, setValue])

  const validateRedirectUrl = useCallback(
    (url: string) => {
      if (url.length === 0) return true
      try {
        new URL(url)
        return true
      } catch (e) {
        setError('redirectUrl', {
          type: 'custom',
          message: 'Invalid URL',
        })
        return false
      }
    },
    [setError]
  )

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        const isValidRedirectUrl = await validateRedirectUrl(
          data.redirectUrl || ''
        )
        if (isValidRedirectUrl) {
          setNavigationLoading(true)
          id ? await updateTokenGate(id, data) : await addTokenGate(data)
          router.push(Routes.home)
        }
      } finally {
        setNavigationLoading(false)
      }
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

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Container>
    )
  }

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
          name={'chainId'}
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControl fullWidth error={Boolean(errors.chainId)} required>
              <InputLabel id="token-gate-chain-label">Chain</InputLabel>
              <Select
                labelId="token-gate-chain-label"
                id="token-gate-chain"
                value={value || ''}
                label="Chain"
                onChange={onChange}
              >
                {Object.entries(SUPPORTED_CHAINS).map(([id, data]) => {
                  return (
                    <MenuItem key={id} value={id}>
                      <Box
                        sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
                      >
                        <Image
                          src={data.icon as string}
                          alt={data.name}
                          width={30}
                          height={30}
                        />
                        {data.name}
                      </Box>
                    </MenuItem>
                  )
                })}
              </Select>
              <FormHelperText>{errors.chainId?.message}</FormHelperText>
            </FormControl>
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

        <Controller
          name={'redirectUrl'}
          control={control}
          defaultValue={null}
          render={({ field: { onChange, value } }) => (
            <TextField
              onChange={onChange}
              value={value || ''}
              fullWidth
              id="token-gate-redirect-url"
              label="Redirect URL"
              name="redirectUrl"
              error={Boolean(errors.redirectUrl)}
              helperText={errors.redirectUrl?.message || helpers.redirectUrl}
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
                    key={req.contractAddress}
                    chainId={chainId}
                    requirement={req}
                    onDelete={(deleted) => {
                      setValue(
                        'requirements',
                        value.filter(
                          (item) =>
                            item.contractAddress !== deleted.contractAddress
                        )
                      )
                    }}
                  />
                ))}
                <TokenGateRequirementForm
                  chainId={chainId}
                  existingRequirements={reqs}
                  onAdd={(req) => {
                    onChange([...reqs, req])
                  }}
                />
              </>
            )
          }}
        />
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
