import React, { useState, useEffect, useCallback, useMemo } from "react"
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
  text-align : center;

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
  width: 150px; 
  border-radius: 12px;
  padding: 12px; 
  border: 1px solid transparent;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 10px;
  font-size: 12px;
 

  .name {
    color: #fff;
    margin-top: 12px;
    cursor: pointer; 
    :hover {
      text-decoration: underline;
    }
  }

  a {
    cursor: pointer;
    text-decoration: underline;
    :hover {
      text-decoration: underline;
    }
  }

`

const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 32px;
  padding-bottom: 32px;
  background-color: rgba(38, 38, 38, 0.6);
  border-radius: 24px;
  padding: 20px;
  padding-top: 40px;
  max-width: 800px;
`

const MintToken = () => {
  const { chainId, account, library } = useWeb3React()

  const [chain, setChain] = useState(42)

  const onMint = useCallback(async (id) => {

    if (chain !== chainId) {
      alert("Incorrect chain!")
    }

    const contract = new ethers.Contract(
      MOCK_NFT[chainId].address,
      MockERC1155Token,
      library.getSigner()
    )

    console.log(account, id, 1, 0)

    try {
      await contract.mint(account, id, 1, "0x")
    } catch (e) {
      console.log(`${e.message}`)
    }

  }, [chainId, chain, account, library])

  const mocks = useMemo(() => {

    if (MOCK_NFT[chain]) {
      return MOCK_NFT[chain].list
    }
    return []
  }, [chain])

  return (
    <Container>
      <Header>
        <h5>Testnet Faucet</h5>
        <p style={{ maxWidth: " 600px", marginLeft: "auto", marginRight: "auto", fontSize: "14px" }}>
          You can mint mock NFTs for testing purpose on any testnet we supported
        </p>
      </Header>
      <div style={{ display: "flex" }}>
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <label>Chain:</label>
          <select onChange={(e) => {
            setChain(Number(e.target.value))
          }}
            value={chain} style={{ width: "135px" }}>
            <option value={42}>Kovan</option>
            <option value={80001}>Mumbai</option>
          </select>
        </div>

      </div>
      <ListContainer>
        {
          mocks.map((nft) => (
            <NFTCard>
              <img src={nft.image} width="100%" height="120px" />
              <a onClick={() => onMint(nft.tokenId)}>
                <div className="name text-center">Mint{` `}{nft.name}{` `}#{nft.tokenId}</div>
              </a>
              {/* <a
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
              </a> */}
            </NFTCard>
          ))}
      </ListContainer>
    </Container>
  )
}

export default MintToken
