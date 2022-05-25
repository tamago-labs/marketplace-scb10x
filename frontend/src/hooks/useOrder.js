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
import { API_BASE, NFT_MARKETPLACE } from "../constants"
import MarketplaceABI from "../abi/marketplace.json"
import NFTABI from "../abi/nft.json"

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

        const { data } = await axios.get(`${API_BASE}/orders`)

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

        const { data } = await axios.get(`${API_BASE}/orders/${id}`)

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

    const createOrder = useCallback(async (values) => {

        if (!account) {
            throw new Error("Wallet not connected")
        }

        const { title } = values;

        const slug = `${(title.toLowerCase()).replace(/ /g, "-")}-${(new Date().valueOf().toString()).slice(-6)}`

        console.log("created by : ", account)

        const { data } = await axios.post(`${API_BASE}/orders`, {
            ...values,
            slug,
            ownerAddress: account
        })

        if (data.status === "error") {
            throw new Error(data.message)
        }

        return {
            orderId: data.orderId
        }
    }, [account])

    const depositNft = useCallback(async (values) => {

        if (!account) {
            throw new Error("Wallet not connected")
        }

        if ((NFT_MARKETPLACE.filter(item => item.chainId === values.chainId)).length === 0) {
            throw new Error("Marketplace contract is not available on given chain")
        }

        if (chainId !== values.chainId) {
            throw new Error("Invalid chain")
        }

        const { contractAddress } = NFT_MARKETPLACE.find(item => item.chainId === values.chainId)

        const contract = new ethers.Contract(contractAddress, MarketplaceABI, library.getSigner())

        const nftContract = new ethers.Contract(values.baseAssetAddress, NFTABI, library.getSigner())

        if (await nftContract.isApprovedForAll(account, contractAddress) === false) {
            const tx = await nftContract.setApprovalForAll(contractAddress, true)
            await tx.wait()
        }

        // only same chain
        const leaves = values.barterList.filter(item => item.chainId === values.chainId).map(item => ethers.utils.keccak256(ethers.utils.solidityPack(["address", "uint256"], [item.assetAddress, item.assetTokenIdOrAmount])))
        console.log("leaves --> ", leaves)
        
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })

        const hexRoot = tree.getHexRoot()

        return await contract.create(
            values.orderId,
            values.baseAssetAddress,
            values.baseAssetTokenId,
            values.baseAssetIs1155,
            hexRoot
        )

    }, [account, chainId, library])

    const signMessage = useCallback(async (message) => {
        return {
            message,
            signature: await library.getSigner().signMessage(message)
        }
    }, [account, library])

    const confirmOrder = useCallback(async ({
        orderId,
        message,
        signature
    }) => {

        if (!account) {
            throw new Error("Wallet not connected")
        }

        const { data } = await axios.post(`${API_BASE}/orders/confirm`, {
            orderId,
            message,
            signature
        })

        if (data.status === "error") {
            throw new Error(data.message)
        }

    }, [account])

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
        return await getMetadata(tokenIdMetadata)
    }

    return {
        getAllOrders,
        getOrder,
        resolveMetadata,
        createOrder,
        confirmOrder,
        depositNft,
        signMessage
    }
}

export default useOrder