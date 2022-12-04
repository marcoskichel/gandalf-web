import { URLS } from '@config/chains'
import { AppCollections } from '@config/firebase'
import { SupportedContractInterfaceAbis } from '@constants/SupportedContractInterfaces'
import { TokenGate, TokenGateRequirement } from '@models/TokenGate'
import { BigNumber, ethers } from 'ethers'
import { doc, getDoc } from 'firebase/firestore'

const getGate = async (gateId: string) => {
  const ref = doc(AppCollections.tokenGates, gateId)
  const document = await getDoc(ref)

  if (document.exists()) {
    return document.data()
  }
  return null
}

const isAccountMetRequirement = async (
  account: string,
  contract: ethers.Contract,
  requirement: TokenGateRequirement
): Promise<boolean> => {
  const balance = await contract.balanceOf(account)
  return balance.gte(BigNumber.from(requirement.amount))
}

const loadRequirement = async (
  requirement: TokenGateRequirement,
  provider: ethers.providers.JsonRpcProvider,
  account?: string
) => {
  const abi = SupportedContractInterfaceAbis[requirement.contractInterface]
  const address = requirement.contractAddress
  const contract = new ethers.Contract(address, abi, provider)
  const contractName = contract.name()

  if (account) {
    const met = await isAccountMetRequirement(account, contract, requirement)
    return { ...requirement, met, contractName }
  }

  return { ...requirement, contractName, met: requirement.met }
}

const checkGateRequirements = async (
  account: string,
  gateId: string,
  requirements: TokenGateRequirement[]
): Promise<TokenGate | null> => {
  const gate = await getGate(gateId)
  if (gate) {
    const [url] = URLS[gate.chainId]
    const provider = new ethers.providers.JsonRpcProvider(url)
    const loadedRequirements = await Promise.all(
      requirements.map(async (requirement) => {
        return loadRequirement(requirement, provider, account)
      })
    )
    return { ...gate, requirements: loadedRequirements }
  }
  return null
}

export { checkGateRequirements }
