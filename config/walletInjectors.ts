import { AbstractConnector } from '@web3-react/abstract-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

export interface WalletInjector {
  name: string
  value: AbstractConnector
}

const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY as string

const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${infuraApiKey}`,
  appName: 'Gandalf Web',
  supportedChainIds: [1, 3, 4, 5, 42],
})

const WalletConnect = new WalletConnectConnector({
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
})

const Metamask = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})

const walletInjectors: Array<WalletInjector> = [
  {
    name: 'Metamask',
    value: Metamask,
  },
  {
    name: 'Wallet Connect',
    value: WalletConnect,
  },
  {
    name: 'Coinbase Wallet',
    value: CoinbaseWallet,
  },
]

export default walletInjectors
