import React, { useState, useEffect, useCallback, useContext } from "react"
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import { Table } from "react-bootstrap"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import Skeleton from "react-loading-skeleton"
import { AssetCard } from "../card"
import NFTCard from "../nftCard"
import { TailSpin } from 'react-loader-spinner'
import useOrder from "../../hooks/useOrder"
// import { useMarketplace } from "../../hooks/useMarketplace"
import { resolveNetworkName, shortAddress } from "../../helper"
import { NFT_MARKETPLACE } from "../../constants"
import { ExternalLink, AlertTriangle } from "react-feather"
import MarketplaceABI from "../../abi/marketplace.json"

const LoadingSpinner = () => {
    return <TailSpin color="#fff" height={24} width={24} />
}

const Wrapper = styled.div.attrs(() => ({
    className: "rounded-md",
}))`
  background: var(--secondary);
  min-height: 200px;
  margin-top: 1rem; 

  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  hr {
    background: white;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .error-message {
    margin-left: 10px;
    font-size: 14px;
    color: var(--danger);
  }
`

const OrderTable = styled(Table)`
  color: #fff;
`

const TableRow = styled.tr`
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`

const ColWithLink = styled.th.attrs((props) => ({ onClick: () => props.navigate(`/order/${props.orderId}`) }))`
    cursor: pointer;
    :hover {
        text-decoration: underline;
    }
`

const OrderItem = ({
    disabled,
    index,
    data,
    loading,
    onCancelOrder,
    onClaim,
    tick
}) => {

    // const [status, setStatus] = useState()
    // const { resolveStatus } = useOrder()

    // const navigate = useNavigate();

    // useEffect(() => {

    //     setTimeout(() => {

    //         if (data && data.chainId && data.orderId) {
    //             resolveStatus({
    //                 chainId: data.chainId,
    //                 orderId: data.orderId
    //             }).then(setStatus)
    //         }

    //     }, 300 * index)

    // }, index, data)

    // useEffect(() => {

    //     if (tick && tick > 0) {
    //         resolveStatus({
    //             chainId: data.chainId,
    //             orderId: data.orderId
    //         }).then(setStatus)
    //     }

    // }, [tick, data])

    return (
        <div style={{ color: "black", textAlign: "center" }}>

            {/* <tr key={index} >
            <ColWithLink navigate={navigate} orderId={data.cid}>{shortAddress(data.cid)}</ColWithLink>
            <ColWithLink navigate={navigate} orderId={data.cid}>{resolveNetworkName(data.chainId)}
                {disabled && <AlertTriangle style={{ marginLeft: "5px" }} size="18px" />}
            </ColWithLink>
            <ColWithLink navigate={navigate} orderId={data.cid}>{(data.timestamp).toLocaleString()}</ColWithLink>
            
            <th>

                <button
                    disabled={loading === Number(data.cid) || disabled}
                    onClick={() => onCancelOrder(data, index)}
                    style={{
                        zIndex: 40,
                        color: "white",
                        borderRadius: "32px",
                        padding: "4px 8px",
                    }}
                    className="btn btn-danger shadow"
                >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        {loading === Number(index) && (
                            <span style={{ marginRight: "10px" }}><LoadingSpinner /></span>
                        )}
                        Cancel
                    </div>

                </button>
            </th>
        </tr> */}
            <button
                disabled={loading === Number(index)}
                onClick={() => onCancelOrder(data, index)}
                style={{
                    zIndex: 40,
                    color: "white",
                    borderRadius: "32px",
                    padding: "4px 8px",
                }}
                className="btn btn-danger shadow"
            >
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {loading === Number(index) && (
                        <span style={{ marginRight: "10px" }}><LoadingSpinner /></span>
                    )}
                    Cancel
                </div>

            </button>
        </div>
    )
}

const OrdersPanel = styled.div`
    display: flex;
    flex-wrap: wrap;  
    padding-top: 10px;
`


const Orders = () => {

    const [loading, setLoading] = useState(-1)
    const [orders, setOrders] = useState([])

    const { getOrdersFromAccount } = useOrder()
    const { account, library, chainId } = useWeb3React()
    const [tick, setTick] = useState(0)

    useEffect(() => {
        chainId && account && getOrdersFromAccount(chainId, account).then(setOrders)
    }, [account, chainId])

    const onCancelOrder = useCallback(
        async (order, index) => {
            setLoading(Number(index))

            const { contractAddress } = NFT_MARKETPLACE.find(
                (item) => item.chainId === order.chainId
            )
            const marketplaceContract = new ethers.Contract(
                contractAddress,
                MarketplaceABI,
                library.getSigner()
            )

            try {
                const tx = await marketplaceContract.cancel(order.cid)
                await tx.wait()
            } catch (e) {
                console.log(e)
            } finally {
                getOrdersFromAccount(chainId, account).then(setOrders)
                setLoading(-1)
                setTick(tick + 1)
            }
        },
        [orders, chainId, account, tick]
    )

    return (
        <Wrapper>
            {/* <OrderTable>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Chain</th>
                        <th>Created</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders
                        ? orders.map((data, index) => {

                            const disabled = data.chainId !== chainId

                            return (
                                <OrderItem
                                    data={data}
                                    index={index}
                                    disabled={disabled}
                                    loading={loading}
                                    onCancelOrder={onCancelOrder}
                                    tick={tick}
                                />
                            )
                        })
                        : ""}
                </tbody>
            </OrderTable> */}

            <OrdersPanel>

                {(!orders || orders.length === 0) && <AssetCard />}

                {(orders.length > 0) &&
                    orders.map((order, index) => {
                        return (
                            <NFTCard key={index} delay={index % orders.length} order={order} >
                                <OrderItem
                                    data={order}
                                    index={index}
                                    // disabled={disabled}
                                    loading={loading}
                                    onCancelOrder={onCancelOrder}
                                    tick={tick}
                                />
                            </NFTCard>
                        );
                    })}

            </OrdersPanel>

        </Wrapper>
    )
}

export default Orders
