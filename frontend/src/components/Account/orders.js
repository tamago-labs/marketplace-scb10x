import React, { useState, useEffect, useCallback, useContext } from "react"
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Table } from "react-bootstrap"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import { LoadingSpinner } from "../loading"
import Skeleton from "react-loading-skeleton"
import useOrder from "../../hooks/useOrder"
import { useMarketplace } from "../../hooks/useMarketplace"
import { resolveNetworkName, resolveStatusName } from "../../helper"
import { NFT_MARKETPLACE } from "../../constants"
import { ExternalLink, AlertTriangle } from "react-feather"
import MarketplaceABI from "../../abi/marketplace.json"

const Wrapper = styled.div.attrs(() => ({
  className: "rounded-md",
}))`
  background: var(--secondary);
  min-height: 200px;
  margin-top: 1rem;
  padding: 20px;

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

const ORDER_STATUS = {
  UNKNOWN: 0,
  NEW: 1,
  SOLD: 2,
  CANCELED: 3
}


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

  const [status, setStatus] = useState()
  const { resolveStatus } = useOrder()

  const navigate = useNavigate();

  useEffect(() => {

    setTimeout(() => {

      if (data && data.chainId && data.orderId) {
        resolveStatus({
          chainId: data.chainId,
          orderId: data.orderId
        }).then(setStatus)
      }

    }, 300 * index)

  }, index, data)

  useEffect(() => {

    if (tick && tick > 0) {
      resolveStatus({
        chainId: data.chainId,
        orderId: data.orderId
      }).then(setStatus)
    }

  }, [tick, data])

  return (

    <tr key={index} >
      <ColWithLink navigate={navigate} orderId={data.orderId}>{data.orderId}</ColWithLink>
      <ColWithLink navigate={navigate} orderId={data.orderId}>{resolveNetworkName(data.chainId)}
        {disabled && <AlertTriangle style={{ marginLeft: "5px" }} size="18px" />}
      </ColWithLink>
      <ColWithLink navigate={navigate} orderId={data.orderId}>{new Date(Number(data.timestamp) * 1000).toLocaleString()}</ColWithLink>
      <ColWithLink navigate={navigate} orderId={data.orderId}>
        {!status ? <Skeleton width="80px" /> : resolveStatusName(status)}
      </ColWithLink>
      <th>

        <button
          disabled={loading === Number(data.orderId) || disabled || status !== 1}
          onClick={() => onCancelOrder(data)}
          style={{
            zIndex: 40,
            color: "white",
            borderRadius: "32px",
            padding: "4px 8px",
          }}
          className="btn btn-danger shadow"
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {loading === Number(data.orderId) && (
              <span style={{ marginRight: "10px" }}><LoadingSpinner /></span>
            )}
            Cancel
          </div>

        </button>

        {/* <Link key={index} to={`/order/${data.orderId}`}>
          <button
            style={{
              zIndex: 10,
              color: "white",
              borderRadius: "32px",
              padding: "4px 8px",
              marginLeft: "5px"
            }}
            className="btn btn-primary shadow"
          >
            <ExternalLink size="16px" />
          </button>
        </Link> */}

        {/* {data.active && (
          <button
            disabled={loading === Number(data.orderId) || disabled}
            onClick={() => onClaim(data)}
            style={{
              zIndex: 10,
              color: "white",
              borderRadius: "32px",
              padding: "4px 8px",
              marginLeft: "8px",
            }}
            className="btn btn-success shadow"
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              {loading === Number(data.orderId) && (
                <span style={{ marginRight: "10px" }}><LoadingSpinner /></span>
              )}
              Claim
            </div>

          </button>
        )} */}
      </th>
    </tr>
  )
}

const Orders = ({
  orders,
  setOrders
}) => {
  const [loading, setLoading] = useState(-1)
  
  const { getAccountOrders, claim } = useOrder()
  const { account, library, chainId } = useWeb3React()
  const [tick, setTick] = useState(0)

 

  const onCancelOrder = useCallback(
    async (order) => {
      setLoading(Number(order.orderId))

      const { contractAddress } = NFT_MARKETPLACE.find(
        (item) => item.chainId === order.chainId
      )
      const marketplaceContract = new ethers.Contract(
        contractAddress,
        MarketplaceABI,
        library.getSigner()
      )

      try {
        const tx = await marketplaceContract.cancel(order.orderId)
        await tx.wait()
      } catch (e) {
        console.log(e)
      } finally {
        getAccountOrders().then(setOrders)
        setLoading(-1)
        setTick(tick + 1)
      }
    },
    [orders, account, tick]
  )

  const onClaim = useCallback(
    async (order) => {
      setLoading(Number(order.orderId))

      try {
        const tx = await claim(order)

        await tx.wait()
      } catch (e) {
        console.log(e)
      }

      setLoading(-1)
    },
    [claim, orders, account]
  )

  return (
    <Wrapper>
      
      <OrderTable>
        <thead>
          <tr>
            <th>#</th>
            {/* <th>Name</th> */}
            <th>Chain</th>
            <th>Created</th>
            <th>Status</th>
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
                  onClaim={onClaim}
                  onCancelOrder={onCancelOrder}
                  tick={tick}
                />
              )
            })
            : ""}
        </tbody>
      </OrderTable>
      <p style={{ marginTop: "1.5rem", textAlign : "center" }}>You will be receiving the NFT back when cancel the order</p>
    </Wrapper>
  )
}

export default Orders
