import React from "react"
import styled, { keyframes } from "styled-components"
import { Link } from "react-router-dom";
import NFTCard from "./nftCard"

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
`

const Lists = () => {
  return (
    <div style={{ marginTop: 32, paddingBottom: 32 }} className="container">
      <Header>
        <div className="title">
          <AnimatedComponent height="50" width="50">
            <circle cx="25" cy="25" r="10" fill="red" />
          </AnimatedComponent>
          NFT Lists
        </div>
        <Link to="/createOrder"
          style={{
            zIndex: 10,
            color: "white",
            borderRadius: "32px",
            padding: "12px 24px",
          }}
          className="btn btn-secondary shadow"
        >
          Create Order
        </Link>
      </Header>
      <ListContainer>
        <NFTCard />
      </ListContainer>
    </div>
  )
}

export default Lists
