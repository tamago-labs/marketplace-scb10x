import { useWeb3React } from "@web3-react/core";
import React, {
    useEffect,
    useMemo,
    useReducer,
    createContext,
    useState,
    useCallback,
} from "react";
import { ethers } from "ethers";
import { getProviders } from "../helper";
import { NFT_MARKETPLACE, SUPPORT_CHAINS } from "../constants";
import MarketplaceABI from "../abi/marketplace.json";
import Moralis from "moralis"
import useMoralisAPI from "./useMoralisAPI";

const useActivities = () => {

    const { generateMoralisParams, resolveClaimTable, resolveSwapTable } = useMoralisAPI()

    const getSwapEvents = async (chainId, orderId) => {
        let result = []

        // checking swaps events

        await Moralis.start(generateMoralisParams(chainId));
        const Monster = Moralis.Object.extend(resolveSwapTable(chainId));
        let query = new Moralis.Query(Monster);

        query.equalTo("orderId", `${orderId}`)

        let results = await query.find();

        for (let i = 0; i < results.length; i++) {
            const object = results[i];
            result.push({
                type: "swap",
                buyer: object.get("fromAddress"),
                chainId : chainId,
                transaction: object.get("transaction_hash"),
                timestamp: object.get("block_timestamp")
            })
        }

        return result
    }

    const getClaimEvents = async (chainId, orderId) => {
        
        let result = []

        await Moralis.start(generateMoralisParams(chainId));

        const Claims = Moralis.Object.extend(resolveClaimTable(chainId));
        let query = new Moralis.Query(Claims);

        query.equalTo("orderId", `${orderId}`)

        let results = await query.find();

        for (let i = 0; i < results.length; i++) {
            const object = results[i];
            result.push({
                type: "claim",
                buyer: object.get("fromAddress"),
                chainId : chainId,
                transaction: object.get("transaction_hash"),
                timestamp: object.get("block_timestamp"),
                isOriginChain : object.get("isOriginChain")
            })
        }

        return result
    }

    const getActivitiesFromOrder = useCallback(async (chainId, orderId) => {

        let results = []
        
        const swapEvents = await getSwapEvents(chainId, orderId)

        results = results.concat(swapEvents)

        // checking claim events
        for (let id of [42, 97, 80001, 43113]) {
            const claimEvents = await getClaimEvents(id, orderId)
            results = results.concat(claimEvents)
        }

        return results.sort(function (a, b) {
            return a.timestamp - b.timestamp;
        });
    }, [])

    const getActivitiesByAccount = useCallback(async (account) => {


        let result = []


        for (let chainId of [42, 97, 80001, 43113]) {
            await Moralis.start(generateMoralisParams(chainId));

            // checking swaps events
            const Monster = Moralis.Object.extend(resolveSwapTable(chainId));
            let query = new Moralis.Query(Monster);
            query.equalTo("fromAddress", `${account.toLowerCase()}`)

            let results = await query.find();

            for (let i = 0; i < results.length; i++) {
                const object = results[i];
                result.push({
                    type: "swap",
                    orderId: object.get("orderId"),
                    chainId: chainId,
                    transaction: object.get("transaction_hash"),
                    timestamp: object.get("block_timestamp")
                })
            }

            // checking claim events
            const Claims = Moralis.Object.extend(resolveClaimTable(chainId));
            query = new Moralis.Query(Claims);

            query.equalTo("fromAddress", `${account.toLowerCase()}`)

            results = await query.find();

            for (let i = 0; i < results.length; i++) {
                const object = results[i];
                result.push({
                    type: "claim",
                    orderId: object.get("orderId"),
                    chainId: chainId,
                    transaction: object.get("transaction_hash"),
                    timestamp: object.get("block_timestamp"),
                    isOriginChain : object.get("isOriginChain")
                })
            }

        }

        return result.sort(function (a, b) {
            return a.timestamp - b.timestamp;
        });

    }, [])

    return {
        getActivitiesFromOrder,
        getActivitiesByAccount
    }
}

export default useActivities