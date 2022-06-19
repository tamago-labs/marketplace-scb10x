const { default: axios } = require("axios");
const { ethers } = require("ethers");

exports.delay = (timer) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, timer * 1000)
    })
}

exports.getProvider = (rpcUrl) => {
    return new ethers.providers.JsonRpcProvider(rpcUrl)
}

exports.getProviders = (chainIds = []) => {
    return chainIds.map(chainId => {

        let url

        if (chainId === 42) {
            url = process.env.KOVAN_RPC_SERVER
        } else if (chainId === 80001) {
            url = process.env.MUMBAI_RPC_SERVER
        } else if (chainId === 97) {
            url = process.env.BNB_TESTNET_RPC_SERVER
        } else if (chainId === 43113) {
            url = process.env.FUJI_RPC_SERVER
        } else if (chainId === 56) {
            url = process.env.BNB_RPC_SERVER
        } else if (chainId === 137) {
            url = process.env.POLYGON_RPC_SERVER
        } else if (chainId === 43114) {
            url = process.env.AVAX_RPC_SERVER
        } else if (chainId === 1) {
            url = process.env.MAINNET_RPC_SERVER
        }

        if (!url) {
            return
        }

        const provider = new ethers.providers.JsonRpcProvider(url)

        return {
            chainId,
            provider
        }
    })
}

exports.getRelayerKey = () => {
    return process.env.RELAYER_KEY
}

exports.getValidatorKey = () => {
    return process.env.VALIDATOR_KEY
}

exports.generateRelayMessages = (items = []) => {
    return items.reduce((output, item) => {

        const { barterList, chainId, orderId } = item

        if (barterList && chainId && barterList.length > 0) {
            for (let item of barterList) {
                // filter non-cross-chain items
                if (item.chainId !== chainId) {
                    output.push({
                        orderId,
                        chainId: item.chainId,
                        assetAddress: item.assetAddress,
                        assetTokenIdOrAmount: item.assetTokenIdOrAmount
                    })
                }
            }
        }

        return output
    }, [])
}


exports.getGasPrices = async (chainId) => {
    let BASE_GAS = 5 // 5 GWEI
    let gasLimit = 100000

    if ([43113].includes(chainId)) {
        BASE_GAS = 27
        gasLimit = 200000
    }

    try {

        let url

        switch (chainId) {
            case 1:
                url = "https://owlracle.info/eth/gas?apikey=cf72e23d385a45639f67e89094cf8eab"
                break
            case 137:
                url = "https://owlracle.info/poly/gas?apikey=cf72e23d385a45639f67e89094cf8eab"
                break
            case 43114:
                url = "https://owlracle.info/avax/gas?apikey=cf72e23d385a45639f67e89094cf8eab"
                break
        }

        if (url) {
            const { data } = await axios.get(url)
            
            BASE_GAS = Math.ceil(data.speeds[1].gasPrice)
            gasLimit = BASE_GAS *10000
        }

    } catch (e) {
        console.log(e)
    }

    return {
        BASE_GAS,
        gasLimit
    }
}
