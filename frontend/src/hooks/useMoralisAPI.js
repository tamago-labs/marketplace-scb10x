import { SUPPORT_CHAINS } from "../constants";

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
        }
    }

    const generateMoralisParams = (chainId) => {
        if (SUPPORT_CHAINS.indexOf(chainId) !== -1) {
            return {
                serverUrl: "https://1ovp3qunsgo4.usemoralis.com:2053/server",
                appId: "enCW1fXy8eMazgGNIgwKdOicHVw67k0AegYAr2eE",
                masterKey: "AdNlpYjZuuiCGzlPaonWrJoGSIB6Scnae2AiNY6B"
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