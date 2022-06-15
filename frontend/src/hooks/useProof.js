import React, {
    useEffect,
    useMemo,
    useReducer,
    createContext,
    useState,
    useCallback,
} from "react";
import { useMoralisWeb3Api } from "react-moralis";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { ethers } from "ethers";
import Moralis from "moralis"
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { API_BASE, NFT_MARKETPLACE, SUPPORT_CHAINS } from "../constants";
import MarketplaceABI from "../abi/marketplace.json";
import NFTABI from "../abi/nft.json";
import ERC20ABI from "../abi/erc20.json";
import collection from "../components/Collection";
import { getProviders } from "../helper"
import useMoralisAPI from "./useMoralisAPI";

window.Buffer = window.Buffer || require("buffer").Buffer;

const useProof = () => {

    const { generateMoralisParams, resolveClaimTable } = useMoralisAPI()

    const generateRelayMessages = async () => {

        const { data } = await axios.get(`${API_BASE}/orders`)
        const { orders } = data

        const messages = orders.filter(item => ((item.confirmed) && (!item.fulfilled) && (!item.canceled))).reduce((output, item) => {

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


        return messages
    }

    const generateBuyerTickets = async ({
        providers,
        relayMessages,
        orders
    }) => {

        let claims = []
        let checks = []

        // find the claim result
        for (let message of relayMessages) {

            const { ownerAddress, chainId, orderId } = orders.find(item => item.orderId === message.orderId)

            // to prevent unnesssary checks
            const check = checks.find(item => item.orderId === orderId && item.chainId === message.chainId)

            if (!check) {
                checks.push({
                    chainId: message.chainId,
                    orderId
                })

                const row = providers.find(item => item.chainId === message.chainId)

                if (row && row.provider) {

                    const { provider } = row
                    const { contractAddress } = NFT_MARKETPLACE.find(item => item.chainId === message.chainId)

                    const marketplaceContract = new ethers.Contract(contractAddress, MarketplaceABI, provider)

                    const result = await marketplaceContract.partialOrders(orderId)

                    if (result['active']) {
                        // Buyer
                        claims.push({
                            orderId: message.orderId,
                            chainId,
                            claimerAddress: result['buyer'],
                            isOrigin: true
                        })

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

        return claims
    }

    const generateSellerTickets = async ({
        orders,
        providers
    }) => {

        let claims = []

        for (let chainId of SUPPORT_CHAINS) {

            await Moralis.start(generateMoralisParams(chainId));

            // checking claim events
            const Claims = Moralis.Object.extend(resolveClaimTable(chainId));
            const query = new Moralis.Query(Claims);

            query.equalTo("isOriginChain", true)

            const results = await query.find();

            // looking for unclaimed orders
            for (let object of results) {

                const orderId = object.get("orderId")
                const fromAddress = object.get("fromAddress")

                const originalItem = orders.find(item => Number(item.orderId) === Number(orderId))

                if (originalItem && originalItem.barterList.length > 0) {

                    const list = originalItem.barterList.sort(function (a, b) {
                        return b.chainId - a.chainId;
                    });

                    for (let pairItem of list) {

                        const row = providers.find(item => Number(item.chainId) === Number(pairItem.chainId))

                        if (row && row.provider) {

                            const { provider } = row
                            const { contractAddress } = NFT_MARKETPLACE.find(item => Number(item.chainId) === Number(pairItem.chainId))

                            const marketplaceContract = new ethers.Contract(contractAddress, MarketplaceABI, provider)
                            try {
                                const result = await marketplaceContract.partialOrders(orderId)

                                if ( !result["ended"] && (result['buyer']).toLowerCase() === fromAddress.toLowerCase()) {
                                    // granting a ticket for the seller
                                    claims.push({
                                        orderId: orderId,
                                        chainId: pairItem.chainId,
                                        claimerAddress: originalItem.ownerAddress,
                                        isOrigin: false
                                    })
                                    break
                                }

                            } catch (e) {
                                // console.log("no active oriders on chain id : ", pairItem.chainId)
                            }
                        }
                    }
                }
            }
        }

        return claims

    }

    const generateValidatorMessages = async () => {

        const { data } = await axios.get(`${API_BASE}/orders`)
        const { orders } = data

        const relayMessages = await generateRelayMessages()

        const providers = getProviders()

        const buyerTickets = await generateBuyerTickets({
            providers,
            relayMessages,
            orders
        })

        const sellerTickers = await generateSellerTickets({
            providers, 
            orders
        })

        const claims = buyerTickets.concat(sellerTickers)

        console.log("Total claims : ", claims.length)

        return claims
    }

    return {
        generateRelayMessages,
        generateValidatorMessages
    }
}

export default useProof