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
import { NFT_MARKETPLACE } from "../constants";
import MarketplaceABI from "../abi/marketplace.json";

import Moralis from "moralis"

/* FIXME :  REMOVE FROM HERE */
const serverUrl = "https://1ovp3qunsgo4.usemoralis.com:2053/server";
const appId = "enCW1fXy8eMazgGNIgwKdOicHVw67k0AegYAr2eE";
const masterKey = "AdNlpYjZuuiCGzlPaonWrJoGSIB6Scnae2AiNY6B";

const useActivities = (chainId) => {



    const generateMoralisParams = (chainId) => {
        if ([42, 80001, 97, 43113]) {
            return {
                serverUrl: "https://1ovp3qunsgo4.usemoralis.com:2053/server",
                appId: "enCW1fXy8eMazgGNIgwKdOicHVw67k0AegYAr2eE",
                masterKey: "AdNlpYjZuuiCGzlPaonWrJoGSIB6Scnae2AiNY6B"
            }
        }

        throw new Error("Chain isn't supported")
    }

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

    const getActivitiesFromOrder = useCallback(async (orderId) => {

        await Moralis.start(generateMoralisParams(chainId));

        let result = []

        // checking swaps events

        const Monster = Moralis.Object.extend(resolveSwapTable(chainId));
        let query = new Moralis.Query(Monster);

        query.equalTo("orderId", `${orderId}`)

        let results = await query.find();

        for (let i = 0; i < results.length; i++) {
            const object = results[i];
            result.push({
                type: "swap",
                buyer: object.get("fromAddress"),
                transaction: object.get("transaction_hash"),
                timestamp: object.get("block_timestamp")
            })
        }

        // checking claim events
        const Claims = Moralis.Object.extend(resolveClaimTable(chainId));
        query = new Moralis.Query(Claims);

        query.equalTo("orderId", `${orderId}`)

        results = await query.find();

        for (let i = 0; i < results.length; i++) {
            const object = results[i];
            result.push({
                type: "claim",
                buyer: object.get("fromAddress"),
                transaction: object.get("transaction_hash"),
                timestamp: object.get("block_timestamp")
            })
        }

        return result
    }, [chainId])

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
                    orderId :  object.get("orderId"),
                    chainId : chainId,
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
                    orderId :  object.get("orderId"),
                    chainId : chainId,
                    transaction: object.get("transaction_hash"),
                    timestamp: object.get("block_timestamp")
                })
            } 

        }

        return result.sort(function (a, b) {
            return a.orderId - b.orderId;
          });

    }, [])

    return {
        getActivitiesFromOrder,
        getActivitiesByAccount
    }
}

export default useActivities