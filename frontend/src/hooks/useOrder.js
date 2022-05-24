import React, {
    useEffect,
    useMemo,
    useReducer,
    createContext,
    useState,
    useCallback,
} from "react"
import { useWeb3React } from '@web3-react/core'
import axios from "axios"
import { ethers } from "ethers"
import { MerkleTree } from "merkletreejs"
import keccak256 from "keccak256"

const useOrder = () => {

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

    return {
        getAllOrders,
        getOrder
    }
}

export default useOrder