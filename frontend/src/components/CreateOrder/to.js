import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Skeleton from "react-loading-skeleton"
import { resolveNetworkName } from "../../helper"

const Content = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-height: 600px;
  overflow: scroll;
  padding: 12px;
  min-height: 600px;
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

  &:hover {
    border: 1px solid pink;
  }

  .name {
    color: #fff;
    margin-top: 12px;
  }
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`

const SearchInput = styled.input.attrs(() => ({
  type: "text",
  placeholder: "Search NFT, Eg. Azuki, Tamago",
}))`
  background: transparent;
  border: 1px solid #fff;
  padding: 12px;
  border-radius: 32px;
  font-size: 16px;
  color: #fff;
  width: 400px;
  margin-top: 12px;

  ::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`

const ChainSelector = styled.select`
  background: transparent;
  border: 1px solid #fff;
  padding: 12px;
  border-radius: 32px;
  font-size: 16px;
  color: #fff;
  min-width: 180px;
  margin-top: 12px;
  margin-left: 12px;
`

const To = ({
  searchNFT,
  toData,
  setToData,
  step,
  setStep,
  setSearchText,
  searchText,
  searchLoading,
  setSearchChain,
  searchChain,
  fetchSearchNFTs,
}) => {
  const shorterName = (name) => {
    return name.length > 28 ? `${name.slice(0, 15)}...${name.slice(-4)}` : name
  }

  const onSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

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

  return (
    <>
      <div className="d-flex justify-content-center my-2">
        <SearchInput value={searchText} onChange={onSearchTextChange} />
        <ChainSelector
          onChange={(e) => setSearchChain(Number(e.target.value))}
          defaultValue={resolveNetworkName(searchChain)}
        >
          <option value={137}>Polygon</option>
          <option value={56}>BNB Chain</option>
          <option value={42}>Kovan Testnet</option>
          <option value={80001}>Mumbai Testnet</option>
        </ChainSelector>
        <a
          style={{
            zIndex: 10,
            color: "white",
            borderRadius: "32px",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            marginLeft: "12px",
          }}
          className="btn btn-primary shadow"
          onClick={fetchSearchNFTs}
        >
          Search
        </a>
      </div>
      <Content>
        {searchNFT && !searchLoading
          ? searchNFT.map((nft, index) => (
              <Card
                key={index}
                selected={toData.find(
                  (data) => data.token_hash === nft.token_hash
                )}
                onClick={() => onClickCard({ ...nft, chainId: searchChain })}
              >
                <img src={nft.metadata.image} width="100%" height="220" />
                <div className="name">
                  {shorterName(nft.metadata.name)}
                  {` `}#{shorterName(nft.token_id)}
                </div>
                <div className="name">Chain: TBD</div>
              </Card>
            ))
          : searchLoading && (
              <>
                <Skeleton
                  height="380px"
                  width="260px"
                  style={{ borderRadius: "12px", margin: "12px" }}
                />
                <Skeleton
                  height="380px"
                  width="260px"
                  style={{ borderRadius: "12px", margin: "12px" }}
                />
                <Skeleton
                  height="380px"
                  width="260px"
                  style={{ borderRadius: "12px", margin: "12px" }}
                />
                <Skeleton
                  height="380px"
                  width="260px"
                  style={{ borderRadius: "12px", margin: "12px" }}
                />
              </>
            )}
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
        {toData && (
          <a
            style={{
              zIndex: 10,
              color: "white",
              borderRadius: "32px",
              padding: "12px 24px",
            }}
            className="btn btn-primary shadow"
            onClick={() => setStep(step + 1)}
          >
            Next
          </a>
        )}
      </ButtonContainer>
    </>
  )
}

export default To
