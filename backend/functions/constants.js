const MARKETPLACES = [
    {
        chainId: 1,
        contractAddress: "0x0213468b5ED54826b363bbC4A90BBc0A5f972c39"
    },
    {
        chainId: 42,
        contractAddress: "0xBa9c7eC462dB716E6F79B7D58a38D0b5E5f79141"
    },
    {
        chainId: 56,
        contractAddress: "0x0d249716de3bE97a865Ff386Aa8A42428CB97347"
    },
    {
        chainId: 97,
        contractAddress: "0x576430Ecadbd9729B32a4cA9Fed9F38331273924"
    },
    {
        chainId: 137,
        contractAddress: "0x6d2Ef00BDcdec6139079A9887C5a0549111215Ea"
    },
    {
        chainId: 43113,
        contractAddress: "0x576430Ecadbd9729B32a4cA9Fed9F38331273924"
    },
    {
        chainId: 43114,
        contractAddress: "0x576430Ecadbd9729B32a4cA9Fed9F38331273924"
    },
    {
        chainId: 80001,
        contractAddress: "0xf2260B00250c772CB64606dBb88d9544F709308C"
    },
]

const supportedChains = MARKETPLACES.map(chain => {
    return chain.chainId
})

const MAINNET_CHAINS = [137, 56, 43114, 1]
const TESTNET_CHAINS = [42, 97, 80001, 43113]

module.exports = {
    MARKETPLACES,
    supportedChains,
    MAINNET_CHAINS,
    TESTNET_CHAINS
}