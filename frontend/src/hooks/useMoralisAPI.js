import { MAINNET_CHAINS, SUPPORT_CHAINS, TESTNET_CHAINS } from "../constants";

const useMoralisAPI = () => {

    const resolveSwapTable = (chainId) => {
        switch (chainId) {
            case 97:
                return "bnbTestnetSwap"
            case 42:
                return "kovanTestnetSwap"
            case 80001:
                return "mumbaiTestnetSwap"
            case 43113:
                return "fujiTestnetSwap"
            case 56:
                return "bnbSwap"
            case 137:
                return "polygonSwap"
            case 43114:
                return "avaxSwap"
            case 1:
                return "ethSwap"
        }
    }

    const resolveClaimTable = (chainId) => {
        switch (chainId) {
            case 97:
                return "bnbTestnetClaim"
            case 42:
                return "kovanTestnetClaim"
            case 80001:
                return "mumbaiTestnetClaim"
            case 43113:
                return "fujiTestnetClaim"
            case 56:
                return "bnbClaim"
            case 137:
                return "bnbClaim"
            case 43114:
                return "avaxClaim"
            case 1:
                return "ethClaim"
        }
    }

    const generateMoralisParams = (chainId) => {
        // FIXME : Remove from here
        if (TESTNET_CHAINS.indexOf(chainId) !== -1) {
            return {
                serverUrl: "https://1ovp3qunsgo4.usemoralis.com:2053/server",
                appId: "enCW1fXy8eMazgGNIgwKdOicHVw67k0AegYAr2eE",
                masterKey: "AdNlpYjZuuiCGzlPaonWrJoGSIB6Scnae2AiNY6B"
            }
        }
        if (MAINNET_CHAINS.indexOf(chainId) !== -1) {
            return {
                serverUrl: "https://cybgqjtb97zb.usemoralis.com:2053/server",
                appId: "c5pJEepQAhugEYhT4xmn5FUvWRij5Rvbpn7yZGJ9",
                masterKey: "1OKt4BCqp7OcDwKmJGmrJTBeadyhfyznSrFnU1IB"
            }
        }
        throw new Error("Chain isn't supported")
    }

    return {
        generateMoralisParams,
        resolveSwapTable,
        resolveClaimTable
    }

}

export default useMoralisAPI