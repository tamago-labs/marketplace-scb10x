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

// RPC server urls retrieved from chainlist.org
const POLYGON_RPC_SERVERS = [
    "https://polygon-mainnet.public.blastapi.io",
    "https://polygon-rpc.com",
    "https://polygonapi.terminet.io/rpc",
    "https://rpc-mainnet.matic.quiknode.pro",
]

const MAINNET_RPC_SERVERS = [
    "https://eth-rpc.gateway.pokt.network",
    "https://eth-mainnet.public.blastapi.io",
    "https://rpc.ankr.com/eth",
]

//note: no good rpc servers on chainlist (using the old infura server for now)
const KOVAN_RPC_SERVERS = [
    "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
]

const MUMBAI_RPC_SERVERS = [
    "https://polygontestapi.terminet.io/rpc",
    "https://rpc.ankr.com/polygon_mumbai",
]

const BNB_RPC_SERVERS = [
    "https://bsc-dataseed2.binance.org",
    "https://bscapi.terminet.io/rpc",
    "https://rpc.ankr.com/bsc",
    "https://bsc-dataseed3.binance.org",
]

const FUJI_RPC_SERVERS = [
    "https://rpc.ankr.com/avalanche_fuji",
    "https://avalanchetestapi.terminet.io/ext/bc/C/rpc",
]

const BNB_TESTNET_RPC_SERVERS = [
    "https://bsctestapi.terminet.io/rpc",
    "https://data-seed-prebsc-2-s2.binance.org:8545",
    "https://data-seed-prebsc-1-s1.binance.org:8545",
]
const AVALANCHE_C_CHAIN_RPC_SERVERS = [
    "https://rpc.ankr.com/avalanche",
    "https://avalancheapi.terminet.io/ext/bc/C/rpc",
    "https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc",
]
const CRONOS_RPC_SERVERS = [
    "https://cronosrpc-1.xstaking.sg",
    "https://evm.cronos.org",
]




module.exports = {
    MARKETPLACES,
    SUPPORTED_CHAINS,
    MAINNET_CHAINS,
    TESTNET_CHAINS,
    WHITELISTED_ADDRESSES,
    CLIENT_BASE,
    COIN_GECKO_API_BASE,
    //rpc servers below
    POLYGON_RPC_SERVERS,
    MAINNET_RPC_SERVERS,
    KOVAN_RPC_SERVERS,
    MUMBAI_RPC_SERVERS,
    BNB_RPC_SERVERS,
    FUJI_RPC_SERVERS,
    BNB_TESTNET_RPC_SERVERS,
    AVALANCHE_C_CHAIN_RPC_SERVERS,
    CRONOS_RPC_SERVERS
}