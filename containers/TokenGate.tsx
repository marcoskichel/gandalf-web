import walletInjectors, { WalletInjector } from '@config/walletInjectors'
import { TokenGate } from '@models/TokenGate'
import { useTokenGates } from '@contexts/TokenGatesContext'
import { Box, Button, Typography } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import TokenGateRequirement from '@components/TokenGateRequirement'

interface Props {
  // clientId: string
  gateId: string
}

const WalletButton = ({ injector }: { injector: WalletInjector }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { chainId } = useWeb3React()

  return (
    <Button
      type="button"
      fullWidth
      size="large"
      variant="text"
      sx={{ mt: 3 }}
      onClick={() => {
        // activate(injector.value)
      }}
    >
      {injector.name}
    </Button>
  )
}

const TokenGate = (props: Props) => {
  const { gateId } = props
  const { findTokenGate } = useTokenGates()

  const [gate, setGate] = useState<TokenGate>()

  useEffect(() => {
    const loadTokenGate = async () => {
      const gate = await findTokenGate(gateId)

      if (!gate.exists()) {
        throw new Error('TokenGate not found')
        // TODO: Redirect to not found page
      }

      setGate(gate.data())
    }

    loadTokenGate()
  }, [findTokenGate, gateId])

  return (
    <Box>
      {gate &&
        gate.requirements.map((req) => (
          <TokenGateRequirement key={req.contract} requirement={req} />
        ))}

      <Typography>Please connect your wallet</Typography>

      {walletInjectors.map((injector) => (
        <WalletButton key={injector.name} injector={injector} />
      ))}
    </Box>
  )
}

export default TokenGate
