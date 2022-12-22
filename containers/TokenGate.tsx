import Requirement from '@components/Requirement'
import { BasicChainInformation, SUPPORTED_CHAINS } from '@config/chains'
import { hooks as metamaskHooks, metamask } from '@config/connectors/metamask'
import { useToaster } from '@contexts/ToasterContext'
import { MetamaskError } from '@models/Errors.'
import { TokenGate } from '@models/TokenGate'
import Navigation from '@containers/Navigation'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { sanitizeUrl } from '@braintree/sanitize-url'

const { useAccount: useMetamaskAccount } = metamaskHooks

interface State {
  gate?: TokenGate
  initialLoading: boolean
  checkingRequirements: boolean
}

const getUrl = (urlLike: string): string => {
  const sanitized = sanitizeUrl(urlLike)
  try {
    const url = new URL(sanitized)
    return url.toString()
  } catch (error) {
    if (sanitized.startsWith('https://')) {
      throw error
    }
    return getUrl(`https://${sanitized}`)
  }
}

const Content = (props: { state: State }) => {
  const { state } = props

  const chain = SUPPORTED_CHAINS[
    state.gate?.chainId as number
  ] as BasicChainInformation

  return (
    <>
      <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {chain?.icon && (
          <Image src={chain?.icon} alt={chain?.name} width={30} height={30} />
        )}
        <Typography variant="h6">{chain?.name} Network</Typography>
      </Box>

      {state.gate?.requirements?.map((req) => (
        <Requirement
          key={req.contractAddress}
          requirement={req}
          isLoading={state.checkingRequirements}
        />
      ))}
    </>
  )
}

const TokenGate = () => {
  const { query, push } = useRouter()
  const { id: gateId, redirectUrl } = query

  const metamaskAccount = useMetamaskAccount()
  const { setToast } = useToaster()

  const [state, setState] = useState<State>({
    initialLoading: true,
    checkingRequirements: false,
  })

  const handleApiResponse = useCallback(
    async (res: Response, stage: 'initial' | 'requirements') => {
      const gate = (await res.json()) as TokenGate
      const allMet = gate.requirements?.every((req) => req.met)
      if (allMet && redirectUrl) {
        const url = getUrl(redirectUrl as string)
        window.location.href = url
      } else {
        setState((prev) => ({
          ...prev,
          gate,
          ...{
            initialLoading: stage === 'initial' ? false : prev.initialLoading,
            checkingRequirements:
              stage === 'requirements' ? false : prev.checkingRequirements,
          },
        }))
      }
    },
    [redirectUrl]
  )

  useEffect(() => {
    const loadGate = async () => {
      if (gateId) {
        const res = await fetch(`/api/token-gates/${gateId}`)
        handleApiResponse(res, 'initial')
      }
    }
    loadGate()
  }, [gateId, push, handleApiResponse, redirectUrl])

  useEffect(() => {
    const checkRequirements = async () => {
      setState((prev) => ({ ...prev, checkingRequirements: true }))
      const res = await fetch(`/api/token-gates/${gateId}`, {
        method: 'POST',
        body: JSON.stringify({ account: metamaskAccount }),
      })
      handleApiResponse(res, 'requirements')
    }
    if (metamaskAccount) {
      checkRequirements()
    }
  }, [gateId, metamaskAccount, handleApiResponse, redirectUrl])

  const connectMetamask = useCallback(async () => {
    if (!metamaskAccount) {
      try {
        await metamask.activate(state.gate?.chainId)
      } catch (err) {
        const error = err as MetamaskError
        console.error(error)

        if (error.code === -32002) {
          setToast({
            message: 'Please continue the connection in the Metamask wallet.',
            severity: 'warning',
          })
        }
      }
    }
  }, [metamaskAccount, setToast, state.gate?.chainId])

  if (state.initialLoading) {
    return (
      <Box
        sx={{
          height: '100vh',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Navigation title="Halt!" />
      <Container component="main" maxWidth="xs">
        <Card>
          <CardHeader
            title="VIP only area ahead"
            subheader="Please confirm the following tokens ownership by connecting your wallet(s)."
          />
          <Divider />
          <CardContent>
            <Content state={state} />
          </CardContent>
          <CardActions>
            <Button
              color="default"
              startIcon={
                <Image
                  src="/icons/metamask.svg"
                  alt="Metamask"
                  width={30}
                  height={30}
                />
              }
              type="button"
              fullWidth
              size="large"
              variant="contained"
              sx={{ mt: 3 }}
              onClick={connectMetamask}
            >
              Connect Metamask
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  )
}

export default TokenGate
