require('dotenv').config()
const Moralis = require("moralis/node");

const { TESTNET_CHAINS, MAINNET_CHAINS } = require("./constants")


/* Moralis init codes */
const MoralisOptions = {
  serverUrl: process.env.MORALIS_SERVER_URL,
  appId: process.env.MORALIS_APP_ID,
  masterKey: process.env.MORALIS_MASTER_KEY,
}

const MoralisOptionsTestnet = {
  serverUrl: process.env.MORALIS_SERVER_URL_TESTNET,
  appId: process.env.MORALIS_APP_ID_TESTNET,
  masterKey: process.env.MORALIS_MASTER_KEY_TESTNET,
}

const generateMoralisParams = (chainId) => {
  if (TESTNET_CHAINS.indexOf(chainId) !== -1) {
    return MoralisOptionsTestnet
  }
  if (MAINNET_CHAINS.indexOf(chainId) !== -1) {
    return MoralisOptions
  }
  throw new Error("Chain isn't supported")
}

module.exports = {
  Moralis,
  MoralisOptions,
  MoralisOptionsTestnet,
  generateMoralisParams
}