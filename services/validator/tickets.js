const { ethers } = require("ethers")

const Moralis = require("moralis/node")

const { NFT_MARKETPLACE, SUPPORT_CHAINS } = require("../constants")
const { MARKETPLACE_ABI } = require("../abi")

// generate claim tickets for buyers and sellers
class Tickets {

    CLAIMS = []

    constructor({
        logger,
        providers,
        messages,
        orders
    }) {

        this.logger = logger
        this.providers = providers

        this.messages = messages
        this.orders = orders

    }

    async update() {
        this.CLAIMS = []

        this.logger.debug("Generate claim tickets for buyers...")

        await this.generateBuyerTickets()

        this.logger.debug("Generate claim tickets for sellers...")

        await this.generateSellerTickets()

    }

    async generateSellerTickets() {

        let claims = []
        let partialOrders = []

        // stores all partial orders in the array
        for (let chainId of SUPPORT_CHAINS) {
            await Moralis.start(this.generateMoralisParams(chainId));

            const PartialSwaps = Moralis.Object.extend(`${this.resolveChainName(chainId)}PartialSwap`);
            const query = new Moralis.Query(PartialSwaps);

            query.limit(1000)

            const results = await query.find();
            for (let object of results) {
                const orderId = object.get("orderId")
                const fromAddress = object.get("fromAddress")

                partialOrders.push({
                    orderId: Number(orderId),
                    fromAddress,
                    chainId
                })
            }
        }

        for (let chainId of SUPPORT_CHAINS) {

            await Moralis.start(this.generateMoralisParams(chainId));

            // checking claim events
            const Claims = Moralis.Object.extend(this.resolveClaimTable(chainId));
            const query = new Moralis.Query(Claims);
            query.equalTo("isOriginChain", true)
            query.limit(1000)

            const results = await query.find();

            // looking for unclaimed orders
            for (let object of results) {

                const orderId = object.get("orderId")
                const fromAddress = object.get("fromAddress")

                const originalItem = this.orders.find(item => Number(item.orderId) === Number(orderId))

                if (originalItem && originalItem.barterList.length > 0) {

                    const list = originalItem.barterList.sort(function (a, b) {
                        return b.chainId - a.chainId;
                    });

                    for (let pairItem of list) {

                        // const row = this.providers.find(item => Number(item.chainId) === Number(pairItem.chainId))

                        // this.logger.debug("[Seller] Checking order : ", orderId)

                        const partialOrdersOnThisChain = partialOrders.filter(item => (Number(item.chainId) === Number(pairItem.chainId)) && (Number(item.orderId) === Number(orderId)))

                        if (partialOrdersOnThisChain.length > 0) {
                            const partialClaimedOrder = partialOrdersOnThisChain.find(item => (item.fromAddress).toLowerCase() === fromAddress.toLowerCase())
                            if (partialClaimedOrder) {
                                // granting a ticket for the seller
                                claims.push({
                                    orderId: Number(orderId),
                                    chainId: pairItem.chainId,
                                    claimerAddress: (originalItem.ownerAddress).toLowerCase(),
                                    isOrigin: false
                                })
                            }
                        }

                        
                    }
                }
            }
        }

        // remove duplicates
        claims = claims.reduce((output, item) => {
            const existing = output.find(x => x.hash === (ethers.utils.hashMessage(JSON.stringify(item))))
            if (!existing) {
                output.push({
                    ...item,
                    hash: ethers.utils.hashMessage(JSON.stringify(item))
                })
            }
            return output
        }, [])

        this.logger.debug("Total seller claims : ", claims.length)

        this.CLAIMS = this.CLAIMS.concat(claims)

    }


    async generateBuyerTickets() {

        let claims = []

        for (let chainId of SUPPORT_CHAINS) {

            await Moralis.start(this.generateMoralisParams(chainId));

            const PartialSwaps = Moralis.Object.extend(`${this.resolveChainName(chainId)}PartialSwap`);
            const query = new Moralis.Query(PartialSwaps);

            query.limit(1000)

            const results = await query.find();

            // setup the watcher
            // this.logger.debug("[Buyer] Setting the watcher for : ", this.resolveChainName(chainId))

            const { marketplaceAddress } = NFT_MARKETPLACE.find(item => Number(item.chainId) === Number(chainId))

            const options = {
                chainId: `0x${chainId.toString(16)}`,
                address: marketplaceAddress.toLowerCase(),
                topic: "PartialSwapped(uint256, address)",
                abi: {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "orderId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "fromAddress",
                            "type": "address"
                        }
                    ],
                    "name": "PartialSwapped",
                    "type": "event"
                },
                limit: 500000,
                tableName: `${this.resolveChainName(chainId)}PartialSwap`,
                sync_historical: true,
            };

            Moralis.Cloud.run("watchContractEvent", options, { useMasterKey: true });

            for (let object of results) {
                const orderId = object.get("orderId")
                const fromAddress = object.get("fromAddress")

                const orderItem = this.orders.find(item => item.orderId === Number(orderId))

                claims.push({
                    orderId: Number(orderId),
                    chainId : orderItem.chainId,
                    claimerAddress: (fromAddress).toLowerCase(),
                    isOrigin: true
                })

            }

        }

        // remove duplicates
        claims = claims.reduce((output, item) => {
            const existing = output.find(x => x.hash === (ethers.utils.hashMessage(JSON.stringify(item))))
            if (!existing) {
                output.push({
                    ...item,
                    hash: ethers.utils.hashMessage(JSON.stringify(item))
                })
            }
            return output
        }, [])

        this.logger.debug("Total buyer claims : ", claims.length)

        this.CLAIMS = this.CLAIMS.concat(claims)

    }

    generateMoralisParams(chainId) {
        if ([42, 80001, 97, 43113].indexOf(chainId) !== -1) {
            return {
                serverUrl: process.env.MORALIS_TESTNET_SERVER_URL,
                appId: process.env.MORALIS_TESTNET_APP_ID,
                masterKey: process.env.MORALIS_TESTNET_MASTER_KEY
            }
        }
        if ([56, 137, 43114, 1].indexOf(chainId) !== -1) {
            return {
                serverUrl: process.env.MORALIS_MAINNET_SERVER_URL,
                appId: process.env.MORALIS_MAINNET_APP_ID,
                masterKey: process.env.MARALIS_MAINNET_MASTER_KEY
            }
        }
        throw new Error("Chain isn't supported")
    }

    resolveClaimTable(chainId) {
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
                return "polygonClaim"
            case 43114:
                return "avaxClaim"
            case 1:
                return "ethClaim"
        }
    }

    resolveChainName(chainId) {
        switch (chainId) {
            case 97:
                return "bnbTestnet"
            case 42:
                return "kovanTestnet"
            case 80001:
                return "mumbaiTestnet"
            case 43113:
                return "fujiTestnet"
            case 56:
                return "bnb"
            case 137:
                return "polygon"
            case 43114:
                return "avax"
            case 1:
                return "eth"
        }
    }

    getClaims() {
        return this.CLAIMS
    }

}

module.exports = {
    Tickets
}