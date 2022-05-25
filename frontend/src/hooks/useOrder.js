import React, {
    useEffect,
    useMemo,
    useReducer,
    createContext,
    useState,
    useCallback,
} from "react"
import { useMoralisWeb3Api } from "react-moralis"
import { useWeb3React } from '@web3-react/core'
import axios from "axios"
import { ethers } from "ethers"
import { MerkleTree } from "merkletreejs"
import keccak256 from "keccak256"

const useOrder = () => {

    const Web3Api = useMoralisWeb3Api()

    const context = useWeb3React()

    const { chainId, account, library } = context

    const [tick, setTick] = useState(0)

    const increaseTick = useCallback(() => {
        setTick(tick + 1)
    }, [tick])

    const getAllOrders = useCallback(async () => {

        let result = []

        const { data } = await axios.get(`https://api.tamago.finance/v2/orders`)

        const { orders } = data

        if (orders) {
            result = orders.filter(item => (!item.fulfilled) && (item.confirmed) && (!item.canceled))
            result = result.sort(function (a, b) {
                return b.orderId - a.orderId;
            });
        }

        return result
    }, [])

    const getOrder = useCallback(async (id) => {

        const { data } = await axios.get(`https://api.tamago.finance/v2/orders/${id}`)

        if (data.status !== "ok") {
            return
        }

        return data.order
    }, [])

    const getMetadata = async (nft) => {
        let metadata = JSON.parse(nft.metadata)

        // fetch from token uri
        if (!metadata && nft && nft.token_uri) {
            console.log("no metadata!")

            const uri = nft.token_uri.replaceAll("000000000000000000000000000000000000000000000000000000000000000", "")
            // proxy 
            const { data } = await axios.get(`https://slijsy3prf.execute-api.ap-southeast-1.amazonaws.com/stage/proxy/${uri}`)

            if (data && data.data) {
                metadata = data.data
            }
        }

        return {
            ...nft,
            metadata,
        }
    }

    const resolveMetadata = async ({
        assetAddress,
        tokenId,
        chainId
    }) => {

        const options = {
            address: `${assetAddress}`,
            token_id: `${tokenId}`,
            chain: `0x${chainId.toString(16)}`,
        };

        const tokenIdMetadata = await Web3Api.token.getTokenIdMetadata(options);
        return await getMetadata( tokenIdMetadata )
    }

    return {
        getAllOrders,
        getOrder,
        resolveMetadata
    }
}

export default useOrder