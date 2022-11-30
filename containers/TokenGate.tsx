import walletInjectors, { WalletInjector } from '@config/walletInjectors'
import { TokenGate } from '@models/TokenGate'
import { useTokenGates } from '@contexts/TokenGatesContext'
import { Box, Button, Typography } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'

interface Props {
  // clientId: string
  gateId: string
}

const WalletButton = ({ injector }: { injector: WalletInjector }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { activate, chainId } = useWeb3React()

  return (
    <Button
      type="button"
      fullWidth
      size="large"
      variant="text"
      sx={{ mt: 3 }}
      onClick={() => {
        activate(injector.value)
      }}
    >
      {injector.name}
    </Button>
  )
}

interface Data {
  gate: TokenGate
}

const getRequiments = (gate: TokenGate, provider: Web3Provider) => {
  const abi = [
    "function name() public view returns (string)",
    "function totalSupply() public view returns (uint256)"
  ]

  return gate.requirements.map((req) => {
    const signer = provider.getSigner()
  })
}

const TokenGate = (props: Props) => {
  const { gateId } = props
  const { findTokenGate } = useTokenGates()
  const { library } = useWeb3React()

  const [data, setData] = useState<Data>()

  useEffect(() => {
    const loadTokenGate = async () => {
      const gate = await findTokenGate(gateId)

      if (!gate.exists()) {
        // TODO: Redirect to not found page
      }

      setData({ gate: gate.data() as TokenGate })
    }

    loadTokenGate()
  }, [findTokenGate, gateId])

  useEffect(() => {
    // TODO: Check if user has requirements
  }, [data])

  return (
    <Box>
      <Typography>Please connect your wallet</Typography>

      {walletInjectors.map((injector) => (
        <WalletButton key={injector.name} injector={injector} />
      ))}
    </Box>
  )
}

export default TokenGate
