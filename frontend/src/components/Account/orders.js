import React, { useState, useEffect, useCallback, useContext } from "react"
import styled from "styled-components"
import { ToastContainer, toast } from "react-toastify"
import { Table } from "react-bootstrap"
import useOrder from "../../hooks/useOrder"
import { resolveNetworkName } from "../../helper"
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
  const { getAccountOrders } = useOrder()

  useEffect(() => {
    getAccountOrders().then(setOrders)
  }, [])

  console.log(orders)

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
                  <th>{data.confirmed ? "New" : "Sold"}</th>
                  <th>
                    <a
                      disabled={loading}
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
