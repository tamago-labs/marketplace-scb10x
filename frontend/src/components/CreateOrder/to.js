import React, { useState, useEffect } from "react"
import styled from "styled-components"

const Content = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-height: 600px;
  overflow: scroll;
  padding: 12px;
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
  placeholder: "Search NFT, Eg. Azuki Metawarden",
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

const To = ({ searchNFT, toData, setToData, step, setStep, setSearchText, searchText }) => {
  const onSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

  return (
    <>
      <div className="d-flex justify-content-center my-2">
        <SearchInput value={searchText} onChange={onSearchTextChange} />
      </div>
      <Content>
        {searchNFT
          ? searchNFT.map((nft, index) => (
              <Card
                key={index}
                selected={toData && toData.token_hash === nft.token_hash}
                onClick={() => setToData(nft)}
              >
                <img src={nft.metadata.image} width="100%" height="220" />
                <div className="name">
                  {nft.metadata.name.length > 28
                    ? `${nft.metadata.name.slice(
                        0,
                        15
                      )}...${nft.metadata.name.slice(-4)}`
                    : nft.metadata.name}
                </div>
                <div className="name">
                  Token ID:{" "}
                  {nft.token_id.length > 28
                    ? `${nft.token_id.slice(0, 15)}...${nft.token_id.slice(-4)}`
                    : nft.token_id}
                </div>
              </Card>
            ))
          : null}
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
