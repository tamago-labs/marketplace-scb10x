#!/usr/bin/env node

require("dotenv").config();
const retry = require("async-retry");
const logger = require('loglevel');
const { ethers } = require("ethers")
const { MerkleTree } = require('merkletreejs')
const keccak256 = require("keccak256")
const axios = require("axios")

logger.enableAll()

const { delay, getProviders, generateRelayMessages, getValidatorKey } = require("../helper")
const { API_BASE, NFT_MARKETPLACE } = require("../constants")
const { GATEWAY_ABI, MARKETPLACE_ABI } = require("../abi")
const { Tickets } = require("./tickets")

async function run({
    pollingDelay,
    errorRetries,
    errorRetriesTimeout
}) {

    try {

        while (true) {

            let retries = 0

            await retry(
                async () => {

                    // fetch all orders from API
                    const { data } = await axios.get(`${API_BASE}/orders`)

                    const { orders } = data

                    const chainIds = orders.filter(item => item.confirmed).reduce((output, item) => {
                        const { chainId } = item
                        if (chainId && output.indexOf(chainId) === -1) {
                            output.push(chainId)
                        }
                        return output
                    }, [])

                    logger.debug(`Prepare providers for chain : ${chainIds}`)

                    const providers = getProviders(chainIds)

                    // get the original messages
                    const messages = generateRelayMessages(orders.filter(item => ((item.confirmed) && (!item.fulfilled) && (!item.canceled))))

                    const tickets = new Tickets({
                        logger,
                        providers,
                        orders,
                        messages
                    })

                    await tickets.update()

                    const claims = tickets.getClaims()

                    logger.debug("Total tickets : ", claims.length)

                    let leaves
                    let tree
                    let hexRoot

                    if (claims.length !== 0) {
                        // Construct the merkle 
                        leaves = claims.map(({ orderId, chainId, claimerAddress, isOrigin }) => ethers.utils.keccak256(ethers.utils.solidityPack(["uint256", "uint256", "address", "bool"], [orderId, chainId, claimerAddress, isOrigin]))) // Order ID, Chain ID, Claimer Address, Is Origin Chain
                        tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
                        hexRoot = tree.getHexRoot()
                    } else {
                        hexRoot = ethers.utils.formatBytes32String("0")
                    }

                    logger.debug("Merkle root to push : ", hexRoot)

                    const push = async (obj) => {

                        const { provider, chainId } = obj

                        const currentBlock = await provider.getBlockNumber()

                        logger.debug(`chain id : ${chainId} stamped at block : ${Number(currentBlock)}`)

                        const wallet = new ethers.Wallet(getValidatorKey(), provider)
                        const walletAddress = wallet.address

                        const row = NFT_MARKETPLACE.find(item => item.chainId === chainId)
                        const { gatewayAddress } = row
                        const gatewayContract = new ethers.Contract(gatewayAddress, GATEWAY_ABI, wallet)

                        const currentRoot = await gatewayContract.claimRoot()

                        logger.debug("Current root on chain id :", chainId ," is : ", currentRoot)

                        let BASE_GAS = 5 // 5 GWEI
                        let gasLimit = 100000

                        if (chainId === 43113) {
                            BASE_GAS = 27
                            gasLimit = 200000
                        }

                        if (currentRoot !== hexRoot) {
                            const tx = await gatewayContract.updateClaimMessage(hexRoot, {
                                from: walletAddress,
                                gasPrice: ethers.utils.parseUnits(`${BASE_GAS * (retries + 1)}`, 'gwei'),
                                gasLimit: 100000 * (retries + 1)
                            })
                            logger.debug("tx on chain id : ", chainId ," is being processed...")
                            await tx.wait()
                        }

                    }

                   await Promise.all(providers.map(item => push(item)))
                },
                {
                    retries: errorRetries,
                    minTimeout: errorRetriesTimeout * 1000, // delay between retries in ms
                    randomize: false,
                    onRetry: error => {
                        console.log(error)
                        logger.debug(error.message)
                    }
                }
            );

            logger.debug("End of execution loop ", (new Date()).toLocaleTimeString())
            await delay(Number(pollingDelay));

        }
    }
    catch (error) {
        // If any error is thrown, catch it and bubble up to the main try-catch for error processing in the Poll function.
        throw typeof error === "string" ? new Error(error) : error;
    }

}


async function Poll(callback) {
    try {

        console.log("Start of process", (new Date()).toLocaleTimeString())

        const executionParameters = {
            pollingDelay: Number(process.env.POLLING_DELAY) || 180, // 3 minutes
            queryDelay: Number(process.env.QUERY_DELAY) || 40,
            queryInterval: { 137: 40000, 1: 4000 },
            errorRetries: Number(process.env.ERROR_RETRIES) || 5,
            errorRetriesTimeout: Number(process.env.ERROR_RETRIES_TIMEOUT) || 10
        }

        await run({ ...executionParameters });

    } catch (error) {

        logger.error(error.message)

        callback(error)
    }
    callback()
}


function nodeCallback(err) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else process.exit(0);
}


// If called directly by node, execute the Poll Function. This lets the script be run as a node process.
if (require.main === module) {
    Poll(nodeCallback)
        .then(() => { })
        .catch(nodeCallback);
}