import React, { useState, useEffect, useCallback, useContext } from "react"
import styled from "styled-components"
import { ToastContainer, toast } from "react-toastify"
import { Table } from "react-bootstrap"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import useOrder from "../../hooks/useOrder"
import { useMarketplace } from "../../hooks/useMarketplace"
import { resolveNetworkName } from "../../helper"
import { NFT_MARKETPLACE } from "../../constants"
import MarketplaceABI from "../../abi/marketplace.json"
import "react-toastify/dist/ReactToastify.css"

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

const Orders = () => {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const { getAccountOrders, claim } = useOrder()
  const { account, library } = useWeb3React()

  useEffect(() => {
    getAccountOrders().then(setOrders)
  }, [])

  const onCancelOrder = useCallback(
    async (order) => {
      setLoading(true)
      const { contractAddress } = NFT_MARKETPLACE.find(
        (item) => item.chainId === order.chainId
      )
      const marketplaceContract = new ethers.Contract(
        contractAddress,
        MarketplaceABI,
        library.getSigner()
      )

      try {
        await marketplaceContract.cancel(order.orderId)
      } catch (e) {
        console.log(e)
      } finally {
        getAccountOrders().then(setOrders)
        setLoading(false)
      }
    },
    [orders, account]
  )

  const onClaim = useCallback(
    async (order) => {
      setLoading(true)

      try {
        const tx = await claim(order)

        await tx.wait()
      } catch (e) {
        console.log(e)
      }

      setLoading(false)
    },
    [claim, orders, account]
  )

  return (
    <Wrapper>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
      <OrderTable>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Chain</th>
            <th>Created</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders
            ? orders.map((data, index) => (
                <tr key={index}>
                  <th>{data.orderId}</th>
                  <th>{data.title}</th>
                  <th>{resolveNetworkName(data.chainId)}</th>
                  <th>{new Date(data.timestamp).toLocaleString()}</th>
                  <th>{data.locked ? "Sold" : "New"}</th>
                  <th>
                    <a
                      disabled={loading}
                      onClick={() => onCancelOrder(data)}
                      style={{
                        zIndex: 10,
                        color: "white",
                        borderRadius: "32px",
                        padding: "4px 8px",
                      }}
                      className="btn btn-danger shadow"
                    >
                      {loading && (
                        <span className="fa fa-spin fa-refresh mr-2" />
                      )}
                      Cancel
                    </a>

                    {data.active && (
                      <a
                        disabled={loading}
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
                        {loading && (
                          <span className="fa fa-spin fa-refresh mr-2" />
                        )}
                        Claim
                      </a>
                    )}
                  </th>
                </tr>
              ))
            : ""}
        </tbody>
      </OrderTable>
    </Wrapper>
  )
}

export default Orders
