import { InjectedConnector } from "@web3-react/injected-connector"
import { UAuthConnector } from "@uauth/web3-react"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"

const RPC = {
  1: "https://mainnet.infura.io/v3",
  42: "https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER",
  56: "https://bsc-dataseed1.binance.org",
  137: "https://rpc-mainnet.maticvigil.com",
  80001: "https://rpc-mumbai.matic.today",
}

const supportedChainIds = [80001, 42, 43113, 97]

export const injected = new InjectedConnector({ supportedChainIds })

export const walletconnect = new WalletConnectConnector({
  rpc: RPC,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 15000,
})

export const uauth = new UAuthConnector({
  clientID: "ItpQh1IrZ8BLztae0KGsl4AvYCQVBpSgXdHS1po9VD8=",
  clientSecret: "xQxSSxj1lYX1D3dLad+Fam8pcVuU1WHeZRNVylPCJsY=",
  redirectUri: "https://app-v2.tamago.finance/callback",
  postLogoutRedirectUri: "https://app-v2.tamago.finance/",
  // Scope must include openid and wallet
  scope: "openid email wallet",

  // Injected and walletconnect connectors are required.
  connectors: { injected, walletconnect },
})

export const Connectors = [
  {
    name: "MetaMask",
    connector: injected,
    imgSrc: "../images/wallet-provider/metamask.png",
  },
  {
    name: "imToken",
    connector: walletconnect,
    imgSrc: "../images/wallet-provider/imToken.png",
  },
  {
    name: "WalletConnect",
    connector: walletconnect,
    imgSrc: "../images/wallet-provider/wallet-connect.svg",
  },
  {
    name: "Unstoppable Domains",
    connector: uauth,
    imgSrc: "../images/wallet-provider/unstopable.jpeg",
  },
]
