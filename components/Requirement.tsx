import { useEffect, useState } from 'react'
import { Provider } from '@ethersproject/providers'
import { hooks } from '@config/connectors/network'
import useContract from 'hooks/useContract'
import { BigNumber } from 'ethers'
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { toWords } from 'number-to-words'

const { useProvider } = hooks

interface Props {
  requirement: { contract: string; amount: number }
}

interface ERC721 {
  name: () => Promise<string>
  symbol: () => Promise<string>
  balanceOf: (owner: string) => Promise<BigNumber>
}

const abi = [
  'function name() view returns (string)',
  // 'function symbol() view returns (string)',
  // 'function balanceOf(address) view returns (uint256)',
]

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const Requirement = (props: Props) => {
  const { requirement } = props

  const provider = useProvider()

  const contract = useContract<ERC721>(
    provider as Provider,
    requirement.contract,
    abi
  )

  const [name, setName] = useState<string>()

  useEffect(() => {
    const loadContractMetadata = async () => {
      if (contract) {
        setName(await contract.name())
      }
    }
    loadContractMetadata()
  }, [contract])

  const isPlural = requirement.amount > 1
  const label = `${capitalizeFirstLetter(toWords(requirement.amount))} item${
    isPlural ? 's' : ''
  } of the "${name}" collection.`

  return (
    <FormControlLabel
      label={label}
      control={
        <Checkbox
          disableRipple
          sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
          checked={false}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      }
    />
  )
}

export default Requirement
