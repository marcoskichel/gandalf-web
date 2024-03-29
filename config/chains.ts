import type { AddEthereumChainParameter } from '@web3-react/types'

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
}

const CELO: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Celo',
  symbol: 'CELO',
  decimals: 18,
}

export interface BasicChainInformation {
  urls: string[]
  name: string
  icon?: string
}

export interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

type Chains = Record<number, BasicChainInformation | ExtendedChainInformation>

export function getAddChainParameters(
  chainId: number
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
}

export const CHAINS: Chains = {
  1: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
      process.env.ALCHEMY_API_KEY
        ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
        : '',
      'https://cloudflare-eth.com',
    ].filter((url) => url !== ''),
    name: ' ETH Mainnet',
  },
  3: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
    ].filter((url) => url !== ''),
    name: 'Ropsten',
  },
  4: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
    ].filter((url) => url !== ''),
    name: 'Rinkeby',
  },
  5: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
    ].filter((url) => url !== ''),
    name: 'Görli',
  },
  42: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
    ].filter((url) => url !== ''),
    name: 'Kovan',
  },
  // Optimism
  10: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
      'https://mainnet.optimism.io',
    ].filter((url) => url !== ''),
    name: 'Optimism',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  69: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
      'https://kovan.optimism.io',
    ].filter((url) => url !== ''),
    name: 'Optimism Kovan',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
  },
  // Arbitrum
  42161: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
      'https://arb1.arbitrum.io/rpc',
    ].filter((url) => url !== ''),
    name: 'Arbitrum One',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  421611: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
      'https://rinkeby.arbitrum.io/rpc',
    ].filter((url) => url !== ''),
    name: 'Arbitrum Testnet',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://testnet.arbiscan.io'],
  },
  // Polygon
  137: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
      'https://polygon-rpc.com',
    ].filter((url) => url !== ''),
    name: 'Polygon Mainnet',
    icon: '/icons/polygon.svg',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  80001: {
    urls: [
      process.env.INFURA_API_KEY
        ? `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`
        : '',
    ].filter((url) => url !== ''),
    name: 'Polygon Mumbai',
    icon: '/icons/polygon.svg',
    nativeCurrency: MATIC,
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
  // Celo
  42220: {
    urls: ['https://forno.celo.org'],
    name: 'Celo',
    nativeCurrency: CELO,
    blockExplorerUrls: ['https://explorer.celo.org'],
  },
  44787: {
    urls: ['https://alfajores-forno.celo-testnet.org'],
    name: 'Celo Alfajores',
    nativeCurrency: CELO,
    blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org'],
  },
}

const supportedChainIds = process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_IDS
  ? process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_IDS.split(',').map(Number)
  : []

export const SUPPORTED_CHAINS = Object.keys(CHAINS)
  .map(Number)
  .filter((id) => supportedChainIds.includes(id))
  .reduce<Chains>((acc, id) => ({ ...acc, [id]: CHAINS[id] }), {})

export const URLS: { [chainId: number]: string[] } = Object.keys(
  SUPPORTED_CHAINS
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs
  }

  return accumulator
}, {})
