import React, { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { useMoralisWeb3Api } from "react-moralis"
import From from "./from"
import To from "./to"
import Confirm from "./confirm"
import { AlertWarning } from "../alert"
import useOrder from "../../hooks/useOrder"


export const PROCESS = {
  FILL: 0,
  GENERATE_ID: 1,
  DEPOSIT: 2,
  CONFIRM: 3,
  COMPLETE: 4
}

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
    props.active ? "rgba(38, 38, 38, 0.6)" : "transparent"};
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
  const [toData, setToData] = useState([])
  const [toTokens, setToTokens] = useState([])
  const [searchText, setSearchText] = useState()
  const [searchNFT, setSearchNFT] = useState()
  const [searchChain, setSearchChain] = useState()
  const [searchFilter, setSearchFilter] = useState(['name'])
  const [step, setStep] = useState(1)
  const [searchLoading, setSearchLoading] = useState(false)
  const Web3Api = useMoralisWeb3Api()
  const { getMetadata } = useOrder()

  const [process, setProcess] = useState(PROCESS.FILL)

  const fetchNFTBalance = useCallback(async ({ chainId, account }) => {
    const options = {
      chain: `0x${chainId.toString(16)}`,
      address: account,
    }
    const { result } = await Web3Api.account.getNFTs(options)

    const data = await Promise.all(result.map(item => getMetadata(item)))

    const filteredData = data.filter((nft) => nft.metadata)
    setNfts(filteredData)
  }, [account, chainId])

  useEffect(() => {
    setSearchNFT([])
  }, [searchChain])

  const fetchSearchNFTs = useCallback(async ({
    searchText,
    searchChain
  }) => {

    if (!searchText || searchText.length <= 2) return
    setSearchLoading(true)
    const options = {
      q: searchText,
      chain: `0x${searchChain.toString(16)}`,
      filter: searchFilter.join(','),
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
    setSearchLoading(false)
  }, [account, chainId, searchChain, searchText, searchFilter])

  useEffect(() => {
    if (!account && !chainId) return

    setSearchChain(chainId)
    fetchNFTBalance({
      chainId,
      account
    })
  }, [account, chainId])

  return (
    <div style={{ marginTop: 32 }} className="container">

      <Title>Create Order</Title>



      {!account && (
        <AlertWarning>
          Connect your wallet to continue
        </AlertWarning>
      )}

      <hr />

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
          searchLoading={searchLoading}
          searchNFT={searchNFT}
          toData={toData}
          setToData={setToData}
          step={step}
          setStep={setStep}
          setSearchText={setSearchText}
          searchText={searchText}
          setSearchChain={setSearchChain}
          searchChain={searchChain}
          fetchSearchNFTs={fetchSearchNFTs}
          toTokens={toTokens}
          setToTokens={setToTokens}
          setSearchFilter={setSearchFilter}
          searchFilter={searchFilter}
        />
      )}

      {/* Confirm Section */}
      {step === 3 && (
        <Confirm
          fromData={fromData}
          toData={toData}
          setToData={setToData}
          step={step}
          setStep={setStep}
          process={process}
          setProcess={setProcess}
          toTokens={toTokens}
        />
      )}

      {/* <div style={{ maxWidth: "800px", marginLeft: "auto", marginRight: "auto", marginTop: "2rem" }}>
        <p style={{ fontSize: "14px", textAlign: "center" }}>
          Please be aware that the UI is being developed, contact us in case if you want to cancel your order or withdraw a dispute.
        </p>
      </div> */}
    </div>
  )
}

export default CreateOrder
