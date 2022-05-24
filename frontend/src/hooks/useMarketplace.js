import { useMemo, useEffect, useState, useCallback } from "react"
import { ethers } from "ethers"
import Marketplace from "../abi/marketplace.json"

export const useMarketplace = (address, account, library, tick) => {
  const nftMarketplaceContract = useMemo(() => {
    if (!account || !address || !library) {
      return
    }
    return new ethers.Contract(address, Marketplace, library.getSigner())
  }, [account, address, library])

  const createOrder = useCallback(
    async (orderId, assetAddress, tokenId, is1155, root) => {
      return await nftMarketplaceContract.createOrder(
        orderId,
        assetAddress,
        tokenId,
        is1155,
        root
      )
    },
    [nftMarketplaceContract, account]
  )

  const createOrderBatch = useCallback(
    async (orderId, assetAddress, tokenId, is1155, root) => {
      return await nftMarketplaceContract.createOrder(
        orderId,
        assetAddress,
        tokenId,
        is1155,
        root
      )
    },
    [nftMarketplaceContract, account]
  )

  const cancelOrder = useCallback(
    async (orderId) => {
      return await nftMarketplaceContract.cancelOrder(orderId)
    },
    [nftMarketplaceContract, account]
  )

  const swap = useCallback(
    async (orderId, assetAddress, tokenId, is1155, proof) => {
      return await nftMarketplaceContract.swap(
        orderId,
        assetAddress,
        tokenId,
        is1155,
        proof
      )
    },
    [nftMarketplaceContract, account]
  )

  const swapBatch = useCallback(
    async (orderId, assetAddress, tokenId, is1155, proof) => {
      return await nftMarketplaceContract.swapBatch(
        orderId,
        assetAddress,
        tokenId,
        is1155,
        proof
      )
    },
    [nftMarketplaceContract, account]
  )

  const allowance = useCallback(
    async (address) => {
      return await nftMarketplaceContract.isApprovedForAll(account, address)
    },
    [nftMarketplaceContract, account]
  )

  const setApproval = useCallback(
    async (address) => {
      return await nftMarketplaceContract.setApprovalForAll(address, true)
    },
    [nftMarketplaceContract]
  )

  return {
    createOrder,
    createOrderBatch,
    cancelOrder,
    swapBatch,
    swap,
    allowance,
    setApproval,
  }
}
