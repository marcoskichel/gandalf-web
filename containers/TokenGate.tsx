import Requirement from '@components/Requirement'
import { BasicChainInformation, CHAINS } from '@config/chains'
import { hooks as metamaskHooks, metamask } from '@config/connectors/metamask'
import { hooks as networkHooks, network } from '@config/connectors/network'
import { useGlobalLoading } from '@contexts/GlobalLoadingContext'
import { useToaster } from '@contexts/ToasterContext'
import { useTokenGates } from '@contexts/TokenGatesContext'
import getContract from '@helpers/getContract'
import { ERC721Abi } from '@models/ERC721'
import { MetamaskError } from '@models/Errors.'
import { DecoratedTokenGateRequirement, TokenGate } from '@models/TokenGate'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material'
import { BigNumber, Contract } from 'ethers'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import useFetch from 'react-fetch-hook'

const { useProvider: useNetworkProvider } = networkHooks
const { useAccount: useMetamaskAccount } = metamaskHooks

interface Props {
  gateId: string
}

interface State {
  loading: boolean
  gate?: TokenGate
  requirements?: DecoratedTokenGateRequirement[]
  chain?: BasicChainInformation
  allMet: boolean
}

const Content = (props: { state: State }) => {
  const { state } = props

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

      {state.requirements?.map((req) => (
        <Requirement key={req.contractAddress} requirement={req} />
      ))}
    </>
  )
}

const TokenGate = (props: Props) => {
  const { gateId } = props

  const networkProvider = useNetworkProvider()
  const metamaskAccount = useMetamaskAccount()

  const { findTokenGate } = useTokenGates()
  const { setToast } = useToaster()
  const { setNavigationLoading } = useGlobalLoading()

  const [state, setState] = useState<State>({
    loading: true,
    allMet: false,
  })

  const { data } = useFetch(`/api/check-requirements`, {
    method: 'POST',
    body: JSON.stringify({
      account: metamaskAccount,
      chainId: state.gate?.chainId,
      requirements: state.gate?.requirements,
    }),
    depends: [!!state.gate, !!metamaskAccount],
  })

  console.log(data)

  // Loads the token gate from the firestore database
  // and connects to the gate chain
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
      await connectToNetwork(gate.chainId)

      setState((prev) => ({
        ...prev,
        ...{
          gate,
          chain: CHAINS[gate.chainId],
        },
      }))
    }

    loadTokenGate()
  }, [findTokenGate, gateId])

  // Decorates the gate requirements with data
  // from the blockchain and sets loading to false
  useEffect(() => {
    const decorateRequirements = async (gate: TokenGate) => {
      if (networkProvider) {
        const requirements = await Promise.all(
          gate.requirements.map(async (req) => {
            const contract = await getContract<Contract>(
              req.contractAddress,
              ERC721Abi,
              networkProvider
            )
            const contractName = await contract.name()
            return { ...req, contract, contractName, met: false }
          })
        )
        setState((prev) => ({ ...prev, ...{ requirements, loading: false } }))
      }
    }

    if (state.gate) {
      decorateRequirements(state.gate)
    }
  }, [networkProvider, state.gate])

  // Check whether requirements were met after a new wallet is connected
  useEffect(() => {
    const checkRequirements = async () => {
      if (metamaskAccount && !state.loading && state.requirements) {
        let requirementsChanged = false
        const updatedRequirements = await Promise.all(
          state.requirements?.map(async (req) => {
            const { contract } = req
            const balance = await contract.balanceOf(metamaskAccount)
            const met = balance.gte(BigNumber.from(req.amount))

            if (met !== req.met) {
              requirementsChanged = true
              return { ...req, met }
            }
            return req
          })
        )

        if (requirementsChanged) {
          const allMet = updatedRequirements.every((req) => req.met)
          setState((prev) => ({
            ...prev,
            ...{ requirements: updatedRequirements, allMet },
          }))
        }
        setNavigationLoading(false)
      }
    }

    checkRequirements()
  }, [metamaskAccount, setNavigationLoading, state.loading, state.requirements])

  const connectMetamask = useCallback(async () => {
    if (!metamaskAccount) {
      try {
        setNavigationLoading(true)
        await metamask.activate(state.gate?.chainId)
      } catch (err) {
        setNavigationLoading(false)
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
  }, [metamaskAccount, setNavigationLoading, setToast, state.gate?.chainId])

  return (
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
  )
}

export default TokenGate
