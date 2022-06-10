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
                        chainId : item.chainId,
                        assetAddress: item.assetAddress,
                        assetTokenIdOrAmount: item.assetTokenIdOrAmount
                    })
                }
            }
        }

        return output
    }, [])
}

