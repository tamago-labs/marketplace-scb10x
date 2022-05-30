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
import ERC20ABI from "../abi/erc20.json"

window.Buffer = window.Buffer || require("buffer").Buffer;

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

            let uri = nft.token_uri.replaceAll("000000000000000000000000000000000000000000000000000000000000000", "")

            if (uri.indexOf("https://") === -1) {
                uri = `https://${uri}`
            }  

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
        console.log("leaves --> ", leaves, values.barterList.filter(item => item.chainId === values.chainId))

        let tree
        let hexRoot

        if (leaves.length > 0) {
            tree = new MerkleTree(leaves, keccak256, { sortPairs: true })

            hexRoot = tree.getHexRoot()
        } else {
            hexRoot = ethers.utils.formatBytes32String("")
        }

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

        const { data } = await axios.get(`${API_BASE}/nft/metadata/${assetAddress}/${tokenId}/0x${chainId.toString(16)}`)

        if (data && data.metadata) {
            return data
        }

        const tokenIdMetadata = await Web3Api.token.getTokenIdMetadata(options);
        return await getMetadata(tokenIdMetadata)
    }

    const resolveStatus = async ({
        orderId,
        chainId
    }) => {

        console.log("resolving status : ", orderId, chainId)

        const providers = getProviders([42, 80001])

        const { provider } = providers.find(item => item.chainId === chainId)

        const { contractAddress } = NFT_MARKETPLACE.find(item => item.chainId === chainId)

        const marketplaceContract = new ethers.Contract(contractAddress, MarketplaceABI, provider)

        const result = await marketplaceContract.orders(orderId)

        if (result["ended"] === true) {
            return 2
        }

        if (result["active"] === true) {
            return 1
        }

        return 0
    }

    const swap = useCallback(async (order, tokenIndex) => {

        if (!account) {
            throw new Error("Wallet not connected")
        }

        if ((NFT_MARKETPLACE.filter(item => item.chainId === order.chainId)).length === 0) {
            throw new Error("Marketplace contract is not available on given chain")
        }

        const token = order.barterList[tokenIndex]

        console.log("current token : ", token)

        if (chainId !== order.chainId) {
            throw new Error("Invalid chain")
        }

        const { contractAddress } = NFT_MARKETPLACE.find(item => item.chainId === order.chainId)

        const contract = new ethers.Contract(contractAddress, MarketplaceABI, library.getSigner())

        if (token.tokenType === 0) {
            // erc20
            const tokenContract = new ethers.Contract(token.assetAddress, ERC20ABI, library.getSigner())

            if ((await tokenContract.allowance(account, contractAddress)).toString() === "0") {
                const tx = await tokenContract.approve(contractAddress, ethers.constants.MaxUint256)
                await tx.wait()
            }

        } else {
            // erc721 / 1155
            const nftContract = new ethers.Contract(token.assetAddress, NFTABI, library.getSigner())

            if (await nftContract.isApprovedForAll(account, contractAddress) === false) {
                const tx = await nftContract.setApprovalForAll(contractAddress, true)
                await tx.wait()
            }

        }

        const leaves = order.barterList.filter(item => item.chainId === chainId).map(item => ethers.utils.keccak256(ethers.utils.solidityPack(["address", "uint256"], [item.assetAddress, item.assetTokenIdOrAmount])))
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })

        const proof = tree.getHexProof(ethers.utils.keccak256(ethers.utils.solidityPack(["address", "uint256"], [token.assetAddress, token.assetTokenIdOrAmount])))

        return await contract.swap(order.orderId, token.assetAddress, token.assetTokenIdOrAmount, token.tokenType, proof)
    }, [account, chainId, library])


    const generateRelayMessages = async () => {

        const { data } = await axios.get(`${API_BASE}/orders`)
        const { orders } = data

        const messages = orders.filter(item => item.confirmed).reduce((output, item) => {

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

    const getProviders = (chainIds = []) => {
        return chainIds.map(chainId => {

            let url

            if (chainId === 42) {
                url = "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
            } else if (chainId === 80001) {
                url = "https://nd-546-345-588.p2pify.com/8947d77065859cda88213b612a0f8679"
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

    const generateValidatorMessages = async () => {

        const { data } = await axios.get(`${API_BASE}/orders`)
        const { orders } = data

        const relayMessages = await generateRelayMessages()

        let claims = []
        let checks = []

        const providers = getProviders([42, 80001])

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

                        // Seller
                        claims.push({
                            orderId: message.orderId,
                            chainId: message.chainId,
                            claimerAddress: ownerAddress,
                            isOrigin: false
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

        console.log("Total claims : ", claims.length)

        return claims
    }

    const partialSwap = useCallback(async (order, token) => {

        console.log("partial swap  ", order.orderId, token, chainId)

        if (!account) {
            throw new Error("Wallet not connected")
        }

        if ((NFT_MARKETPLACE.filter(item => item.chainId === token.chainId)).length === 0) {
            throw new Error("Marketplace contract is not available on given chain")
        }

        if (chainId !== token.chainId) {
            throw new Error("Invalid chain")
        }

        const { contractAddress } = NFT_MARKETPLACE.find(item => item.chainId === token.chainId)

        const contract = new ethers.Contract(contractAddress, MarketplaceABI, library.getSigner())

        if (token.tokenType === 0) {
            // erc20
            const tokenContract = new ethers.Contract(token.assetAddress, ERC20ABI, library.getSigner())

            if ((await tokenContract.allowance(account, contractAddress)).toString() === "0") {
                const tx = await tokenContract.approve(contractAddress, ethers.constants.MaxUint256)
                await tx.wait()
            }

        } else {
            // erc721 / 1155
            const nftContract = new ethers.Contract(token.assetAddress, NFTABI, library.getSigner())

            if (await nftContract.isApprovedForAll(account, contractAddress) === false) {
                const tx = await nftContract.setApprovalForAll(contractAddress, true)
                await tx.wait()
            }

        }

        const currentData = await contract.partialOrders(order.orderId)

        console.log("current buyer --> ", currentData['buyer'])

        if (currentData['buyer'] !== account) {

            const messages = await generateRelayMessages()

            console.log("messages --> ", messages)

            const leaves = messages.map(({ orderId, chainId, assetAddress, assetTokenIdOrAmount }) => ethers.utils.keccak256(ethers.utils.solidityPack(["uint256", "uint256", "address", "uint256"], [orderId, chainId, assetAddress, assetTokenIdOrAmount]))) // Order ID, Chain ID, Asset Address, Token ID
            const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })

            const proof = tree.getHexProof(ethers.utils.keccak256(ethers.utils.solidityPack(["uint256", "uint256", "address", "uint256"], [order.orderId, token.chainId, token.assetAddress, token.assetTokenIdOrAmount])))

            const tx = await contract.partialSwap(order.orderId, token.assetAddress, token.assetTokenIdOrAmount, token.tokenType, proof)
            await tx.wait()

        }


    }, [account, chainId, library])

    const claim = useCallback(async (order, token) => {

        console.log("claiming  ", order.orderId, token, chainId)

        if (!account) {
            throw new Error("Wallet not connected")
        }

        if ((NFT_MARKETPLACE.filter(item => item.chainId === order.chainId)).length === 0) {
            throw new Error("Marketplace contract is not available on given chain")
        }

        if (chainId !== order.chainId) {
            throw new Error("Invalid chain")
        }

        const { contractAddress } = NFT_MARKETPLACE.find(item => item.chainId === order.chainId)

        const contract = new ethers.Contract(contractAddress, MarketplaceABI, library.getSigner())

        const messages = await generateValidatorMessages()

        console.log("validator messages length : ", messages.length)

        const leaves = messages.map(({ orderId, chainId, claimerAddress, isOrigin }) => ethers.utils.keccak256(ethers.utils.solidityPack(["uint256", "uint256", "address", "bool"], [orderId, chainId, claimerAddress, isOrigin]))) // Order ID, Chain ID, Claimer Address, Is Origin Chain
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })

        const proof = tree.getHexProof(ethers.utils.keccak256(ethers.utils.solidityPack(["uint256", "uint256", "address", "bool"], [order.orderId, order.chainId, account, true])))

        const tx = await contract.claim(order.orderId, true, proof)

        await tx.wait()

    }, [account, chainId, library])

    return {
        getAllOrders,
        getOrder,
        resolveMetadata,
        createOrder,
        confirmOrder,
        depositNft,
        signMessage,
        swap,
        partialSwap,
        claim,
        resolveStatus
    }
}

export default useOrder