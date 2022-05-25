import React, { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { Link } from "react-router-dom";
import NFTCard from "./nftCard"
import Skeleton from "react-loading-skeleton"
import useOrder from "../hooks/useOrder"


const Header = styled.div`
  display: flex;
  justify-content: space-between;

  .title {
    font-weight: 600;
    font-size: 32px;
    color: #fff;
  }
`

function blinkingEffect() {
  return keyframes`
	50% {
		opacity: 0;
	}
`
}

const AnimatedComponent = styled.svg`
  animation: ${blinkingEffect} 1s linear infinite;
`

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
`

const Lists = () => {

  const [orders, setOrders] = useState([])

  const { getAllOrders } = useOrder()

  useEffect(() => {

    getAllOrders().then(setOrders)

  }, [])

  return (
    <div style={{ marginTop: 32, paddingBottom: 32 }} className="container">
      <Header>
        <div className="title">
          <AnimatedComponent height="50" width="50">
            <circle cx="25" cy="25" r="10" fill="red" />
          </AnimatedComponent>
          New Orders
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ marginTop: "auto", marginBottom: "auto" }}>
            <label>Chain:</label>
            <select style={{width : "135px"}}>
              <option value="all">All</option>
              {/* <option value="polygon">Polygon</option>
              <option value="bnb">BNB Chain</option>
              <option value="kovan">Kovan Testnet</option>
              <option value="mumbai">Mumbai Testnet</option> */}
            </select>
          </div>

        </div>
      </Header>
      <ListContainer>
        {orders.length === 0 &&
          <>
            Loading...
          </>
        }

        {
          orders.length > 0 && orders.map((order, index) => {
            return (
              <Link to={`/order/${order.orderId}`}>
                <NFTCard key={index} id={index} order={order} />
              </Link>
            )
          })
        }
      </ListContainer>
    </div>
  )
}

export default Lists
