import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import NFTCard from "./nftCard";
import Skeleton from "react-loading-skeleton";
import useOrder from "../hooks/useOrder";
import { Button } from "./buttons";

const Header = styled.div`
  display: flex;
  justify-content: space-between;

  .title {
    font-weight: 600;
    font-size: 32px;
    color: #fff;
  }

  @media only screen and (max-width: 600px) {
    .title {
      font-weight: 600;
      font-size: 18px;
    }
  }
`;

function blinkingEffect() {
  return keyframes`
	50% {
		opacity: 0;
	}
`;
}

const AnimatedComponent = styled.svg`
  animation: ${blinkingEffect} 1s linear infinite;
`;

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
`;

const MAX_ITEMS = 4;

const Lists = () => {
  const [orders, setOrders] = useState([]);

  const [max, setMax] = useState(MAX_ITEMS);

  const { getAllOrders } = useOrder();

  useEffect(() => {
    getAllOrders().then(setOrders);
  }, []);

  return (
    <div style={{ marginTop: 32, paddingBottom: 32 }} className="container">
      <Header>
        <div className="title">
        🔥New Orders
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ marginTop: "auto", marginBottom: "auto" }}>
            <label>Chain:</label>
            <select style={{ width: "135px" }}>
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
        {orders.length === 0 && <>Loading...</>}

        {orders.length > 0 &&
          orders.map((order, index) => {
            if (index > max - 1) {
              return;
            }
            return (
              <NFTCard key={index} delay={index % MAX_ITEMS} order={order} />
            );
          })}
      </ListContainer>

      <div style={{ padding: "20px", marginTop: "1rem", textAlign: "center" }}>
        {orders.length > max && (
          <Button onClick={() => setMax(max + 4)}>More...</Button>
        )}
      </div>
    </div>
  );
};

export default Lists;
