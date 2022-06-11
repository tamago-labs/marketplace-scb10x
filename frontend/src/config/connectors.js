import { InjectedConnector } from "@web3-react/injected-connector"

const RPC = {
  1: "https://mainnet.infura.io/v3",
  42: "https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER",
  56: "https://bsc-dataseed1.binance.org",
  137: "https://rpc-mainnet.maticvigil.com",
  80001: "https://rpc-mumbai.matic.today",
}

const supportedChainIds = [80001, 42, 43113, 97]

export const injected = new InjectedConnector({ supportedChainIds })

export const Connectors = [
  {
    name: "MetaMask",
    connector: injected,
    imgSrc: "../images/wallet-provider/metamask.png"
  }
]
