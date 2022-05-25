import React, { useState } from "react"
import { useWeb3React } from "@web3-react/core"

import styled from "styled-components"
import { ArrowRight } from "react-feather"

import { resolveNetworkName } from "../../helper"

const Content = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 12px;
  width: 33%;
  max-height: 600px;

  .title {
    font-size: 32px;
  }
`

const Card = styled.div`
  background-color: rgba(38, 38, 38, 0.6);
  width: 260px;
  height: 344px;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  margin: 12px;
  opacity: ${(props) => (props.selected ? "0.64" : "100")};
  border: ${(props) =>
    props.selected ? "1px solid pink" : "1px solid transparent"};
  position: relative;

  .name {
    color: #fff;
    margin-top: 12px;
  }

  &:hover {
    image {
      opacity: 0.5;
    }

    .remove {
      opacity: 100%;
      display: block;
    }
  }

  .remove {
    display: none;
    color: #000;
    background-color: rgba(255, 255, 255, 0.86);
    position: absolute;
    border-radius: 32px;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 140px;
  }
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`

const Confirm = ({ fromData, toData, step, setStep, setToData }) => {
  const { chainId } = useWeb3React()

  const onClickCard = (nft) => {
    if (toData.find((data) => data.token_hash === nft.token_hash)) {
      const newNFTArray = toData.filter(
        (data) => data.token_hash !== nft.token_hash
      )
      setToData(newNFTArray)
    } else {
      setToData([...toData, nft])
    }
  }

  console.log(toData)

  return (
    <>
      <Content>
        <CardContainer>
          <div className="title">From</div>
          <Card>
            <img src={fromData.metadata.image} width="100%" />
            <div className="name">
              {fromData.name || fromData.metadata.name}
              {` `}#{fromData.token_id}
            </div>
            <div className="name">Chain: {resolveNetworkName(chainId)}</div>
          </Card>
        </CardContainer>
        <CardContainer>
          <ArrowRight size="100px" />
        </CardContainer>
        <CardContainer style={{ overflow: "scroll" }}>
          <div className="title">To</div>
          {toData
            ? toData.map((nft, index) => (
                <Card onClick={() => onClickCard(nft)} key={index}>
                  <div className="remove">Remove</div>
                  <img src={nft.metadata.image} width="100%" height="220" />
                  <div className="name">{nft.metadata.name}</div>
                  <div className="name">Token ID: {nft.token_id}</div>
                </Card>
              ))
            : null}
        </CardContainer>
      </Content>
      <ButtonContainer>
        {step > 1 && (
          <a
            style={{
              zIndex: 10,
              color: "white",
              borderRadius: "32px",
              padding: "12px 24px",
            }}
            className="btn btn-secondary shadow mx-4"
            onClick={() => setStep(step - 1)}
          >
            Back
          </a>
        )}
        {fromData && toData && (
          <a
            style={{
              zIndex: 10,
              color: "white",
              backgroundImage:
                "linear-gradient(to right, #f55f8d 0, #f8ae56 51%, #f55f8d 100%)",
              borderRadius: "32px",
              padding: "12px 24px",
            }}
            className="btn shadow"
            onClick={() => setStep(step + 1)}
          >
            Confirm
          </a>
        )}
      </ButtonContainer>
    </>
  )
}

export default Confirm
