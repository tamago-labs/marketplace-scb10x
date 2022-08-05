const MARKETPLACES = [
    {
        chainId: 1,
        contractAddress: "0x0213468b5ED54826b363bbC4A90BBc0A5f972c39"
    },
    {
        chainId: 25,
        contractAddress: "0xf2260B00250c772CB64606dBb88d9544F709308C",
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

const SUPPORTED_CHAINS = MARKETPLACES.map(chain => {
    return chain.chainId
})

const MAINNET_CHAINS = [137, 56, 43114, 1, 25];
const TESTNET_CHAINS = [42, 97, 80001, 43113]

const WHITELISTED_ADDRESSES = [
    "0x64E489BF82b8aF1fbd609ECE3b7dadFF2e2380A9",
    "0x50D0aD29e0dfFBdf5DAbf4372a5a1A1C1d28A6b1",
    "0x27dDF44eC9E32343599F7B939e4c35c034f78076",
]

const CLIENT_BASE = "https://marketplace-10x.tamago.finance"

const COIN_GECKO_API_BASE = "https://api.coingecko.com/api/v3";

POLYGON_RPC_SERVERS = ["https://nd-643-057-168.p2pify.com/2ffe10d04df48d14f0e9ff6e0409f649"]
MAINNET_RPC_SERVERS = ["https://nd-814-913-142.p2pify.com/cb3fe487ef9afa11bda3c38e54b868a3"]
KOVAN_RPC_SERVERS = ["https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"]
MUMBAI_RPC_SERVERS = ["https://nd-546-345-588.p2pify.com/8947d77065859cda88213b612a0f8679"]
BNB_RPC_SERVERS = ["https://nd-886-059-484.p2pify.com/b62941033adcd0358ff9f38df217f856"]
FUJI_RPC_SERVERS = ["https://nd-473-270-876.p2pify.com/613a7805f3d64a52349b6ca19b6e27a7/ext/bc/C/rpc"]
BNB_TESTNET_RPC_SERVERS = ["https://nd-390-191-961.p2pify.com/0645132aa2a233d3fbe27116f3b8828b"]
AVALANCHE_C_CHAIN_RPC_SERVERS = ["https://nd-752-163-197.p2pify.com/fd84ccbd64f32d8f8a99adb5d4557b0e/ext/bc/C/rpc"]
//TODO add cronos here




module.exports = {
    MARKETPLACES,
    SUPPORTED_CHAINS,
    MAINNET_CHAINS,
    TESTNET_CHAINS,
    WHITELISTED_ADDRESSES,
    CLIENT_BASE,
    COIN_GECKO_API_BASE,
    //RPC SERVERS
    POLYGON_RPC_SERVERS,
    MAINNET_RPC_SERVERS,
    KOVAN_RPC_SERVERS,
    MUMBAI_RPC_SERVERS,
    BNB_RPC_SERVERS,
    FUJI_RPC_SERVERS,
    BNB_TESTNET_RPC_SERVERS,
    AVALANCHE_C_CHAIN_RPC_SERVERS
}