import Requirement from '@components/Requirement'
import { metamask } from '@config/connectors/metamask'
import { network, hooks } from '@config/connectors/network'
import { useTokenGates } from '@contexts/TokenGatesContext'
import { TokenGate } from '@models/TokenGate'
import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'

const { useProvider } = hooks
interface Props {
  gateId: string
}

const TokenGate = (props: Props) => {
  const { gateId } = props
  const { findTokenGate } = useTokenGates()

  const [gate, setGate] = useState<TokenGate>()
  const provider = useProvider()

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
      const gate = await findTokenGate(gateId)

      if (!gate.exists()) {
        throw new Error('TokenGate not found')
        // TODO: Redirect to not found page
      }

      const data = gate.data()
      await connectToNetwork(data.chainId)

      setGate(gate.data())
    }

    loadTokenGate()
  }, [findTokenGate, gateId])

  return (
    <Box sx={{ paddingTop: '8rem' }}>
      {provider &&
        gate?.requirements.map((req) => (
          <Requirement key={req.contract} requirement={req} />
        ))}

      <Button
        type="button"
        fullWidth
        size="large"
        variant="text"
        sx={{ mt: 3 }}
        onClick={() => {
          metamask.activate(gate?.chainId)
        }}
      >
        Connect Metamask
      </Button>
    </Box>
  )
}

export default TokenGate
