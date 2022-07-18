import React, {
  useEffect,
  useMemo,
  useReducer,
  createContext,
  useState,
  useCallback,
} from "react"
import { useWeb3React } from "@web3-react/core"
import axios from "axios"
import { API_BASE } from "../constants"

const useDispute = () => {
  const { chainId, account, library } = useWeb3React()

  const [tick, setTick] = useState(0)

  const increaseTick = useCallback(() => {
    setTick(tick + 1)
  }, [tick])

  const signMessage = useCallback(
    async (message) => {
      return {
        message,
        signature: await library.getSigner().signMessage(message),
      }
    },
    [account, library, chainId]
  )

  const createDispute = useCallback(
    async ({
      email,
      address,
      orderLink,
      crossChain,
      comments,
      message,
      signature,
    }) => {
      if (!account) {
        throw new Error("Wallet not connected")
      }

      const { data } = await axios.post(`${API_BASE}/disputes`, {
        email,
        address,
        orderLink,
        type: crossChain ? "cross-chain" : "intra-chain",
        comments,
        message,
        signature,
      })

      return { disputeId: data.body.disputeId }
    },
    [account, chainId, library]
  )

  const getDisputesByOwner = useCallback(async (ownerAddress) => {
    const { data } = await axios.get(
      `${API_BASE}/disputes/address/${ownerAddress}`
    )
    if (data.status != "ok") {
      return
    }
    return data.disputes
  }, [])

  const updateDispute = useCallback(
    async ({
      disputeId,
      resolved,
      adminComment,
      message,
      signature,
    }) => {
      if (!account) {
        throw new Error("Wallet not connected")
      }

      const { data } = await axios.post(`${API_BASE}/disputes/update/${disputeId}`, {
        resolved: resolved || false,
        adminComment: adminComment || "",
        message,
        signature,
      })

      return { status: data.status, updated: data.updated }
    },
    [account, chainId, library]
  )


  return {
    signMessage,
    createDispute,
    getDisputesByOwner,
    updateDispute,
  }
}

export default useDispute
