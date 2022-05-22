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

exports.DUMMY = [
    {
        orderId: 1,
        chainId: 42,
        confirmed: false,
        ownerAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
        baseAssetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
        baseAssetTokenId: 1,
        baseAssetIs1155: false,
        barterList: [
            {
                assetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
                assetTokenIdOrAmount: "1",
                tokenType: 1,
                chainId: 80001
            },
            {
                assetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
                assetTokenIdOrAmount: "1",
                tokenType: 1,
                chainId: 80001
            }
        ]
    },
    {
        orderId: 2,
        chainId: 80001,
        confirmed: false,
        ownerAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
        baseAssetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
        baseAssetTokenId: 1,
        baseAssetIs1155: false,
        barterList: [
            {
                assetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
                assetTokenIdOrAmount: "1",
                tokenType: 1,
                chainId: 80001
            },
            {
                assetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
                assetTokenIdOrAmount: "1",
                tokenType: 1,
                chainId: 80001
            }
        ]
    },
    {
        orderId: 3,
        chainId: 42,
        confirmed: true,
        ownerAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
        baseAssetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
        baseAssetTokenId: 1,
        baseAssetIs1155: false,
        barterList: [
            {
                assetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
                assetTokenIdOrAmount: "1",
                tokenType: 1,
                chainId: 80001
            },
            {
                assetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
                assetTokenIdOrAmount: "1",
                tokenType: 1,
                chainId: 80001
            }
        ]
    },
    {
        orderId: 4,
        chainId: 80001,
        confirmed: true,
        ownerAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
        baseAssetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
        baseAssetTokenId: 1,
        baseAssetIs1155: false,
        barterList: [
            {
                assetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
                assetTokenIdOrAmount: "1",
                tokenType: 1,
                chainId: 42
            },
            {
                assetAddress: "0xaF00d9c1C7659d205e676f49Df51688C9f053740",
                assetTokenIdOrAmount: "1",
                tokenType: 1,
                chainId: 80001
            }
        ]
    }
]