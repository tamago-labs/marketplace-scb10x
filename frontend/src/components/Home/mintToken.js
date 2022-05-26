import React, { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import MockERC1155Token from "../../abi/mockERC1155Token.json"
import { MOCK_NFT } from "../../constants"
import { resolveNetworkName } from "../../helper"

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
`

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

const NFTCard = styled.div`
  background-color: rgba(38, 38, 38, 0.6);
  width: 260px;
  min-height: 380px;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  border: 1px solid transparent;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 10px;

  &:hover {
    border: 1px solid pink;
  }

  .name {
    color: #fff;
    margin-top: 12px;
  }
`

const MintToken = () => {
  const { chainId, account, library } = useWeb3React()

  const onMint = async (id) => {
    const contract = new ethers.Contract(
      MOCK_NFT[chainId].address,
      MockERC1155Token,
      library.getSigner()
    )

    console.log(account, id, 1, 0)
    await contract.mint(account, id, 1, "0x")
  }

  return (
    <div style={{ marginTop: 32, paddingBottom: 32 }} className="container">
      <Header>
        <div className="title">
          <AnimatedComponent height="50" width="50">
            <circle cx="25" cy="25" r="10" fill="red" />
          </AnimatedComponent>
          Mint NFTs (Testnet Only)
        </div>
      </Header>
      <ListContainer>
        {MOCK_NFT[chainId] &&
          MOCK_NFT[chainId].list.map((nft) => (
            <NFTCard>
              <img src={nft.image} width="100%" height="220" />
              <div className="name">{nft.name}</div>
              <div className="name">Chain: {resolveNetworkName(chainId)}</div>
              <a
                style={{
                  color: "white",
                  borderRadius: "32px",
                  marginTop: "12px",
                  width: "100%",
                }}
                className="btn btn-primary shadow"
                onClick={() => onMint(nft.tokenId)}
              >
                Mint
              </a>
            </NFTCard>
          ))}
      </ListContainer>
    </div>
  )
}

export default MintToken
