import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { useMoralisWeb3Api } from "react-moralis"
import From from "./from"
import To from "./to"
import Confirm from "./confirm"

const Title = styled.div`
  font-weight: bold;
  font-size: 32px;
  color: #fff;
  width: 100%;
  display: flex;
  justify-content: center;
`

const StepHeader = styled.div`
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const Step = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  .circle {
    border: 1px solid #fff;
    background: ${(props) =>
      props.active ? "rgba(255, 255,255 , 0.38)" : "transparent"};
    width: 24px;
    height: 24px;
    margin-right: 8px;
    display: flex;
    justify-content: center;
    border-radius: 50%;
    font-size: 14px;
  }
`

const CreateOrder = () => {
  const { account, chainId } = useWeb3React()
  const [nfts, setNfts] = useState()
  const [fromData, setFromData] = useState()
  const [toData, setToData] = useState()
  const [searchText, setSearchText] = useState()
  const [searchNFT, setSearchNFT] = useState()
  const [step, setStep] = useState(1)
  const Web3Api = useMoralisWeb3Api()

  const fetchNFTBalance = async () => {
    const options = {
      chain: `0x${chainId.toString(16)}`,
      address: account,
    }
    const { result } = await Web3Api.account.getNFTs(options)
    const data = result.map((nft) => {
      const metadata = JSON.parse(nft.metadata)
      return {
        ...nft,
        metadata,
      }
    })
    const filteredData = data.filter((nft) => nft.metadata)
    setNfts(filteredData)
  }

  const fetchSearchNFTs = async () => {
    const options = {
      q: searchText,
      chain: `0x${chainId.toString(16)}`,
      filter: "name",
    }
    const { result } = await Web3Api.token.searchNFTs(options)
    const data = result.map((nft) => {
      const metadata = JSON.parse(nft.metadata)
      return {
        ...nft,
        metadata,
      }
    })
    const filteredData = data.filter((nft) => nft.metadata)
    setSearchNFT(filteredData)
  }

  useEffect(() => {
    if (!account && !chainId) return

    fetchNFTBalance()
  }, [account, chainId])

  useEffect(() => {
    if (!searchText || searchText.length <= 2) return
    fetchSearchNFTs()
  }, [searchText])

  return (
    <div style={{ marginTop: 32 }} className="container">
      <Title>Create Order</Title>
      <StepHeader>
        <Step active={step === 1}>
          <div className="circle">1</div>
          From
        </Step>
        <Step active={step === 2}>
          <div className="circle">2</div>To
        </Step>
        <Step active={step === 3}>
          <div className="circle">3</div>Confirm
        </Step>
      </StepHeader>
      {/* From Section */}
      {step === 1 && (
        <From
          nfts={nfts}
          fromData={fromData}
          setFromData={setFromData}
          step={step}
          setStep={setStep}
        />
      )}

      {/* To Section */}
      {step === 2 && (
        <To
          searchNFT={searchNFT}
          toData={toData}
          setToData={setToData}
          step={step}
          setStep={setStep}
          setSearchText={setSearchText}
          searchText={searchText}
        />
      )}

      {/* Confirm Section */}
      {step === 3 && (
        <Confirm
					fromData={fromData}
					toData={toData}
          step={step}
          setStep={setStep}
        />
      )}
    </div>
  )
}

export default CreateOrder
