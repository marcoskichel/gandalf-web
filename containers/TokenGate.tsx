import Requirement from '@components/Requirement'
import { BasicChainInformation, CHAINS } from '@config/chains'
import { metamask } from '@config/connectors/metamask'
import { network } from '@config/connectors/network'
import { useTokenGates } from '@contexts/TokenGatesContext'
import { TokenGate } from '@models/TokenGate'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useToaster } from '@contexts/ToasterContext'
import { useCheckList } from '@contexts/ChecklistContext'

interface Props {
  gateId: string
}

interface State {
  loading: boolean
  gate?: TokenGate
  chain?: BasicChainInformation
}

interface MetamaskError {
  code: number
}

const Content = (props: { state: State }) => {
  const { state } = props

  const { checklist } = useCheckList()

  if (state.loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  const chain = state.chain as BasicChainInformation

  return (
    <>
      <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {chain?.icon && (
          <Image src={chain.icon} alt={chain.name} width={30} height={30} />
        )}
        <Typography variant="h6">{chain.name} Network</Typography>
      </Box>
      {state.gate?.requirements.map((req) => (
        <Requirement
          key={req.contract}
          requirement={req}
          met={checklist[req.contract]}
        />
      ))}
    </>
  )
}

const TokenGate = (props: Props) => {
  const { gateId } = props
  const { findTokenGate } = useTokenGates()
  const { setToast } = useToaster()
  const { setChecklist } = useCheckList()

  const [state, setState] = useState<State>({ loading: true })

  useEffect(() => {
    const connectToNetwork = async (chainId: number) => {
      try {
        await network.activate(chainId)
      } catch (err) {
        // TODO: Handle connection errors
        console.error(err)
      }
    }

    const loadTokenGate = async () => {
      const doc = await findTokenGate(gateId)

      if (!doc.exists()) {
        throw new Error('TokenGate not found')
        // TODO: Redirect to not found page
      }

      const gate = doc.data()
      setChecklist(
        gate.requirements
          .map((req) => req.contract)
          .reduce(
            (checklist, key) => ({ ...checklist, ...{ [key]: false } }),
            {}
          )
      )
      await connectToNetwork(gate.chainId)

      setState({ loading: false, gate, chain: CHAINS[gate.chainId] })
    }

    loadTokenGate()
  }, [findTokenGate, gateId, setChecklist])

  const connectMetamask = useCallback(async () => {
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
  }, [setToast, state.gate?.chainId])

  return (
    <Card sx={{ marginTop: '8rem' }}>
      <CardHeader
        title="Halt! VIP only area ahead"
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
  )
}

export default TokenGate
