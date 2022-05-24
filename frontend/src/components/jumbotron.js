import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  .left {
    font-size: 32px;
    color: #fff;
    width: 50%;

    .action {
      width: 100%;
      display: flex;
			margin-top: 12px;
    }
  }

  .right {
    width: 50%;
    text-align: center;
  }
`

const Jumbotron = () => {
  return (
    <div style={{ marginTop: 40 }} className="container">
      <Container>
        <div className="left">
          We Provide Web3 Smart Raffle On-Chain Solutions to Empower Every NFT
          Community
          <div className="action">
            <a
              style={{
                zIndex: 10,
                color: "white",
                borderRadius: "32px",
                padding: "12px 24px",
              }}
              className="btn btn-primary shadow mx-4"
            >
              Buy
            </a>
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
          </div>
        </div>
        <div className="right">
          <img width="460" height="460" src="/images/illustration-eggs.png" />
        </div>
      </Container>
    </div>
  )
}

export default Jumbotron
