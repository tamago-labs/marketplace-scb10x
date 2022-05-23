import React from "react"
import styled from "styled-components"

const Container = styled.div`
  background-color: rgba(38, 38, 38, 0.6);
  width: 260px;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    border: 1px solid pink;
  }

  .name {
    color: #fff;
    margin-top: 12px;
  }
`

const NFTCard = () => {
  return (
    <Container>
      <img src="/images/illustration-eggs.png" width="100%" height="220" />
      <div className="name">Clone X</div>
      <div className="name">Token ID: 32</div>
      <a
        style={{
          color: "white",
          borderRadius: "32px",
					marginTop: "12px",
					width: "100%"
        }}
        className="btn btn-primary shadow"
      >
        Buy
      </a>
    </Container>
  )
}

export default NFTCard
