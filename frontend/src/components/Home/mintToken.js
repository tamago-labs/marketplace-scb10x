import React, { useState, useEffect, useCallback, useMemo } from "react"
import styled, { keyframes } from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import MockERC1155Token from "../../abi/mockERC1155Token.json"
import { MOCK_NFT } from "../../constants"
import { resolveNetworkName } from "../../helper"
import ERC20ABI from "../../abi/erc20.json"
import MockNFT from "../../abi/mockNFT.json"

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

const TOKENS = [
  {
    symbol: "USDC",
    chainId: 42,
    contract: "0x8F6e0835CCA21892d5296D58EB0C8206B623BF2B"
  },
  {
    symbol: "USDT",
    chainId: 42,
    contract: "0x8afc69A0C245f4d84Ba160F19df1F76a44991d65"
  },
  {
    symbol: "DAI",
    chainId: 42,
    contract: "0xC926A3F31Ad3db8f27Bbfe4aD42a19A0BCaD8059"
  },
  {
    symbol: "USDC",
    chainId: 80001,
    contract: "0x553588e084604a2677e10E46ea0a8A8e9D859146"
  },
  {
    symbol: "USDT",
    chainId: 80001,
    contract: "0x61ad3Fe6B44Bfbbcec39c9FaD566538c894b6471"
  },
  {
    symbol: "DAI",
    chainId: 80001,
    contract: "0x42209A0A2a3D80Ad48B7D25fC6a61ad355901484"
  },
]

const MintToken = () => {
  const { chainId, account, library } = useWeb3React()

  const [chain, setChain] = useState(42)

  const onMint = useCallback(async (address, id) => {

    if (chain !== chainId) {
      alert("Incorrect chain!")
    }

    try {
      if (address === "0xf4d331039448182cf140de338177706657df8ce9" || address === "0x65e38111d8e2561aDC0E2EA1eeA856E6a43dC892") {
        const contract = new ethers.Contract(
          address,
          MockNFT,
          library.getSigner()
        )
        await contract.mint()
      } else {
        const contract = new ethers.Contract(
          address,
          MockERC1155Token,
          library.getSigner()
        )
        await contract.mint(account, id, 1, "0x")
      }
    } catch (e) {
      console.log(`${e.message}`)
    }

  }, [chainId, chain, account, library])

  const onMintERC20 = useCallback(async (symbol) => {

    if (chain !== chainId) {
      alert("Incorrect chain!")
    }

    const row = TOKENS.find(item => item.symbol === symbol)

    const contract = new ethers.Contract(
      row.contract,
      ERC20ABI,
      library.getSigner()
    )
    try {
      await contract.faucet()
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

  const tokens = TOKENS.filter(item => item.chainId === chain)

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
              <a onClick={() => onMint(nft.address, nft.tokenId)}>
                <div className="name text-center">Mint{` `}{nft.name}{` `}#{nft.tokenId}</div>
              </a>
            </NFTCard>
          ))}


        {tokens.map((token, index) => {
          return (
            <NFTCard key={index}>
              <div style={{ display: "flex", height: "120px", width: "100%", border :"1px solid white"}}>
                <div style={{ margin: "auto" }}>
                  ERC-20
                </div>
              </div>
              <a onClick={() => onMintERC20(token.symbol)}>
                <div className="name text-center">Mint{` `}{token.symbol}</div>
              </a>
            </NFTCard>
          )
        })

        }

      </ListContainer>
    </Container>
  )
}

export default MintToken
