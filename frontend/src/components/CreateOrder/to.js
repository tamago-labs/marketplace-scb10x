import React, { useState, useEffect, useMemo, useCallback } from "react"
import styled from "styled-components"
import Skeleton from "react-loading-skeleton"
import { resolveNetworkName } from "../../helper"
import MOCKS from "../../mocks"
import { ethers } from "ethers"
import { X } from "react-feather"

const TableContainer = styled.div`
background-color: rgba(38, 38, 38, 0.6);
padding: 10px;
margin-top: 1rem;
max-width: 600px;
margin-left:auto;
margin-right: auto;
border-radius: 12px;

.table {
  color: white;
}

`

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

const AmountInput = styled.input.attrs(() => ({
  type: "number",
  placeholder: "Amount",
}))`
  background: transparent;
  border: 1px solid #fff;
  padding: 12px;
  border-radius: 32px;
  font-size: 16px;
  color: #fff;
  width: 200px;
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
  margin-right: 12px;
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
  toTokens,
  setToTokens
}) => {

  const [isNft, setNft] = useState(true)
  const [currentToken, setCurrentToken] = useState()
  const [tokenAmount, setTokenAmount] = useState()

  const shorterName = (name) => {
    return name.length > 28 ? `${name.slice(0, 15)}...${name.slice(-4)}` : name
  }

  useEffect(() => {
    if (searchChain) {
      setCurrentToken()
    }
  }, [searchChain])

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

  const tokens = useMemo(() => {
    return [""].concat(MOCKS.filter(item => item.chainId === searchChain && item.tokenType === 0))
  }, [searchChain])

  const onAdd = useCallback(() => {

    console.log(currentToken, tokenAmount)

    if (tokenAmount && currentToken) {
      const token = tokens.find(item => item.symbol === currentToken)
      setToTokens([
        ...toTokens
        ,
        {
          assetAddress: token.contractAddress,
          assetTokenIdOrAmount: `${(ethers.utils.parseUnits(`${tokenAmount}`, token.decimals)).toString()}`,
          tokenType: 0,
          chainId: token.chainId,
          decimals: token.decimals,
          symbol: token.symbol
        }
      ])
    }
  }, [tokens, currentToken, tokenAmount, toTokens])

  const onTokenRemove = useCallback((index) => {
    setToTokens( toTokens.filter( (item , i ) => index !== i) )
  }, [toTokens])

  return (
    <>
      <div className="d-flex justify-content-center my-2">

        <ChainSelector
          onChange={(e) => {
            if (e.target.value === "true") {
              setNft((true))
            } else {
              setNft((false))
            }

          }}
          defaultValue={(isNft)}
        >
          <option style={{ color: "black" }} value={true}>NFT</option>
          <option style={{ color: "black" }} value={false}>ERC-20</option>
        </ChainSelector>
        <ChainSelector
          onChange={(e) => {
            setSearchChain(Number(e.target.value))

          }}
          defaultValue={(searchChain)}
        >
          <option style={{ color: "black" }} value={137}>Polygon</option>
          <option style={{ color: "black" }} value={56}>BNB Chain</option>
          <option style={{ color: "black" }} value={42}>Kovan Testnet</option>
          <option style={{ color: "black" }} value={80001}>Mumbai Testnet</option>
        </ChainSelector>

        {isNft &&
          (
            <>

              <SearchInput value={searchText} onChange={onSearchTextChange} />

              <div style={{ display: "flex", marginTop: "auto", marginBottom: "auto" }}>
                <a
                  style={{
                    zIndex: 10,
                    color: "white",
                    borderRadius: "32px",
                    padding: "12px 24px",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "12px",
                    marginTop: "12px"
                  }}
                  className="btn btn-primary shadow"
                  onClick={() => fetchSearchNFTs({
                    searchText,
                    searchChain
                  })}
                >
                  Search
                </a>
              </div>
            </>
          )

        }

        {!isNft &&
          <>
            <div style={{ display: "flex", marginTop: "auto", marginBottom: "auto" }}>


              <ChainSelector
                onChange={(e) => {
                  setCurrentToken((e.target.value))
                }}
                defaultValue={(currentToken)}
              >
                {tokens.map((token, index) => {
                  return (
                    <option key={index} style={{ color: "black" }} value={token.symbol}>{token.symbol}</option>
                  )
                })

                }
              </ChainSelector>

              <AmountInput value={tokenAmount} onChange={(e) => setTokenAmount(Number(e.target.value))} />

              <a
                style={{
                  zIndex: 10,
                  color: "white",
                  borderRadius: "32px",
                  padding: "12px 24px",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "12px",
                  marginTop: "12px"
                }}
                className="btn btn-primary shadow"
                onClick={onAdd}
              >
                Add
              </a>
            </div>
          </>
        }

      </div>
      {isNft &&
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
                <div className="name">Chain: {resolveNetworkName(searchChain)}</div>
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

      }

      {!isNft && toTokens.length > 0 &&
        <>
          <TableContainer>

            <table className="table">

              <tbody>

                {toTokens.map((token, index) => {
                  return (
                    <tr key={index} >
                      <td>#{index + 1}</td>
                      <td>
                        {resolveNetworkName(token.chainId)}
                      </td>
                      <td>
                        {token.symbol}
                      </td>
                      <td>
                        {ethers.utils.formatUnits(token.assetTokenIdOrAmount, token.decimals)}
                      </td>
                      <td>
                        <X style={{ cursor: "pointer" }} onClick={() => onTokenRemove(index)} />
                      </td>
                    </tr>
                  )
                })

                }

         
              </tbody>

            </table>

          </TableContainer>
        </>

      }

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
