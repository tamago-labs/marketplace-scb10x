import React, { useEffect, useState, useCallback } from "react"
import styled from "styled-components"
import { resolveNetworkName } from "../../helper"
import useOrder from "../../hooks/useOrder"
import Skeleton from "react-loading-skeleton"
import { Puff } from "react-loading-icons"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"
import CrosschainSwapModal from "../Modal/CrosschainSwapModal"

const Container = styled.div`
  background-color: rgba(38, 38, 38, 0.6);
  width: 260px;
  min-height: 380px;
  border-radius: 12px;
  padding: 12px; 
  border: 1px solid transparent;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 10px;

  .name {
    color: #fff;
    margin-top: 12px;
  }
`

export const CROSSCHAIN_SWAP_PROCESS = {
    NONE: 0,
    PREPARE: 1,
    DEPOSIT: 2,
    APPROVE: 3,
    COMPLETE: 4
}

const shorterName = (name) => {
    return name.length > 28 ? `${name.slice(0, 15)}...${name.slice(-4)}` : name
}

const delay = (timer) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, timer * 1000)
    })
}

const AssetCard = ({ order, item, crossChain, id, account }) => {

    const { chainId } = useWeb3React()
    const { resolveMetadata, partialSwap, claim, swap } = useOrder()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)

    const [crosschainProcess, setCrosschainProcess] = useState(CROSSCHAIN_SWAP_PROCESS.NONE)

    useEffect(() => {
        return () => {
            setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.NONE)
        }
    }, [])

    useEffect(() => {

        if (item && item.tokenType !== 0) {

            setTimeout(() => {

                resolveMetadata({
                    assetAddress: item.assetAddress,
                    tokenId: item.assetTokenIdOrAmount,
                    chainId: item.chainId
                }).then(setData)

            }, (id + 1) * 1000)

        }

        return () => {
            setData()
        }

    }, [item, id])

    const onSwap = useCallback(async (index) => {

        setLoading(true)

        try {

            const tx = await swap(order, index)
            await tx.wait()
        } catch (e) {
            console.log(e)
            alert(`${e.message}`)
        }

        setLoading(false)

    }, [order, swap])

    const onWaiting = useCallback(async () => {

        const max = 10

        let count = 0

        while (max > count) {

            count += 1

            await delay(1)
        }

        setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.APPROVE)

    }, [])

    const onPartialSwap = useCallback(async () => {

        setLoading(true)

        try {

            await partialSwap(order, item)

            setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.DEPOSIT)

            onWaiting()

        } catch (e) {
            alert(e.message)
        }

        setLoading(false)

    }, [order, item, partialSwap])

    const onClaim = useCallback(async () => {

        setLoading(true)

        try {

            await claim(order, item)

            setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.COMPLETE)

        } catch (e) {
            alert(e.message)
        }

        setLoading(false)

    }, [order, item, claim])

    return (
        <>

            <CrosschainSwapModal
                toggle={() => setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.NONE)}
                visible={crosschainProcess !== CROSSCHAIN_SWAP_PROCESS.NONE}
                process={crosschainProcess}
                item={item}
                order={order}
                onPartialSwap={onPartialSwap}
                onClaim={onClaim}
                loading={loading}
            />

            <Container>

                {item.tokenType !== 0 &&
                    <>
                        {data ? <img src={data.metadata && data.metadata.image ? data.metadata.image : "https://via.placeholder.com/200x200"} width="100%" height="220" />
                            : <Skeleton height="220px" />
                        }
                        <div className="name">
                            {data ? `${shorterName(data.metadata.name)} #${shorterName(item.assetTokenIdOrAmount)} ` : <Skeleton height="16px" />}
                        </div>
                    </>
                }

                {item.tokenType === 0 &&
                    <>
                        <div style={{ display: "flex", height: "220px" }}>
                            <div style={{ margin: "auto", fontSize: "24px" }}>
                                ERC-20
                            </div>
                        </div>
                        <div className="name"> {ethers.utils.formatUnits(item.assetTokenIdOrAmount, item.decimals)}{` `}{item.symbol}</div>
                    </>
                }

                <div className="name">Chain: {resolveNetworkName(item.chainId)}</div>

                {!crossChain &&
                    <button
                        style={{
                            color: "white",
                            borderRadius: "32px",
                            marginTop: "12px",
                            width: "100%"
                        }}
                        className="btn btn-primary shadow"
                        onClick={() => onSwap(item.index)}
                        disabled={loading || !account}
                    >
                        {loading &&
                            <Puff height="24px" style={{ marginRight: "5px" }} width="24px" />}
                        Swap
                    </button>
                }
                {crossChain &&
                    <>
                        <button
                            style={{
                                color: "white",
                                borderRadius: "32px",
                                marginTop: "12px",
                                width: "100%"
                            }}
                            className="btn btn-primary shadow"
                            disabled={loading || !account}
                            onClick={() => setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.PREPARE)}
                        >
                            Swap
                        </button>
                        {/* <p style={{ fontSize: "12px", color: "red", textAlign: "center", marginTop: "10px" }}>
                            Validator is Temporarily Stopped
                        </p> */}
                    </>
                }
                {item.chainId !== chainId && (
                    <p style={{ fontSize: "12px", color: "red", textAlign: "center", marginTop: "10px" }}>
                        Incorrect chain
                    </p>
                )}
            </Container>
        </>
    )
}

export default AssetCard
