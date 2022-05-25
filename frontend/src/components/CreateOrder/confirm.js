import React, { useCallback, useState, useMemo } from "react"
import { useWeb3React } from "@web3-react/core"

import styled from "styled-components"
import { ArrowRight, Check, X } from "react-feather"
import { Puff } from "react-loading-icons"
import { resolveNetworkName } from "../../helper"
import { PROCESS } from "./"
import { Alert } from "../alert"

import useOrder from "../../hooks/useOrder"

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

const TableContainer = styled.div`
  background-color: rgba(38, 38, 38, 0.6);
  padding: 10px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;

  .table {
    color: white;
  }
`

const orderTemplate = {
  orderId: 0,
  category: "Unknown",
  title: "",
  slug: "",
  timestamp: 0,
  chainId: 42,
  crosschain: false, // not used
  ownerAddress: "",
  baseAssetAddress: "",
  baseAssetTokenId: 0,
  baseAssetIs1155: false,
  barterList: [],
}

const getOrderTemplate = () => {
  let order = orderTemplate
  const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
  order["title"] = `My Order #${randomNumber}`
  return order
}

const Confirm = ({ fromData, toData, step, setStep, process, setProcess, setToData }) => {
  const [loading, setLoading] = useState(false)

  const { createOrder, depositNft, signMessage, confirmOrder } = useOrder()

  const { chainId, account } = useWeb3React()
  const [orderId, setOrderId] = useState()

  const values = useMemo(() => {
    let order = getOrderTemplate()

    if (orderId) {
      order.orderId = orderId
    }

    if (fromData) {
      order.chainId = chainId
      order.baseAssetAddress = fromData.token_address
      order.baseAssetTokenId = fromData.token_id
      order.baseAssetIs1155 =
        fromData.contract_type === "ERC1155" ? true : false
    }

    if (toData) {
      order.barterList = [
        {
          assetAddress: toData.token_address,
          assetTokenIdOrAmount: toData.token_id,
          tokenType: toData.contract_type === "ERC1155" ? 2 : 1,
          chainId: 42,
        },
        {
          assetAddress: toData.token_address,
          assetTokenIdOrAmount: toData.token_id,
          tokenType: toData.contract_type === "ERC1155" ? 2 : 1,
          chainId: 80001,
        },
      ]
    }

    return order
  }, [fromData, toData, orderId, chainId])

  const onGenerateId = useCallback(async () => {
    console.log("creating --> ", values)

    setLoading(true)

    try {
      const { orderId } = await createOrder(values)
      console.log("order Id : ", orderId)
      setOrderId(orderId)
      setProcess(PROCESS.GENERATE_ID)
    } catch (e) {
      console.log(e)
    }

    setLoading(false)
  }, [values, createOrder])

  const onDeposit = useCallback(async () => {
    console.log("depositing --> ", values)

    setLoading(true)

    try {
      const tx = await depositNft(values)

      await tx.wait()

      setProcess(PROCESS.DEPOSIT)
    } catch (e) {
      console.log(e)
    }

    setLoading(false)
  }, [values])

  const onConfirm = useCallback(async () => {
    const message = "Please sign this message to confirm your order."

    const { signature } = await signMessage(message)

    setLoading(true)

    try {
      await confirmOrder({
        orderId,
        message,
        signature,
      })

      setProcess(PROCESS.CONFIRM)
    } catch (e) {
      console.log(e)
    }

    setLoading(false)
  }, [values, orderId])

  const proceed = useCallback(() => {
    switch (process) {
      case PROCESS.FILL:
        onGenerateId()
        break
      case PROCESS.GENERATE_ID:
        onDeposit()
        break
      case PROCESS.DEPOSIT:
        onConfirm()
        break
      case PROCESS.CONFIRM:
        setProcess(PROCESS.CONFIRM)
        break
      default:
        setProcess(PROCESS.FILL)
    }
  }, [process, onGenerateId, onDeposit, onConfirm])

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
            <img src={fromData.metadata.image} width="100%" height="220" />
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

      <TableContainer>
        <table className="table">
          <thead>
            <tr>
              <td>#</td>
              <td>Process</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Upload an entry to the storage (ID:{orderId})</td>
              <td>{process > 0 ? <Check /> : <X />}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Deposit your base asset</td>
              <td>{process > 1 ? <Check /> : <X />}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Sign a message to confirm</td>
              <td>{process > 2 ? <Check /> : <X />}</td>
            </tr>
          </tbody>
        </table>
      </TableContainer>

      <p className="mt-3 text-center">
        To confirm the order, you must complete above steps one by one.
      </p>

      {process === PROCESS.CONFIRM && (
        <Alert>Your order has been successfully created!</Alert>
      )}

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
          <button
            style={{
              zIndex: 10,
              color: "white",
              backgroundImage:
                "linear-gradient(to right, #f55f8d 0, #f8ae56 51%, #f55f8d 100%)",
              borderRadius: "32px",
              padding: "12px 24px",
            }}
            className="btn shadow"
            disabled={loading || process === PROCESS.CONFIRM}
            onClick={proceed}
          >
            {loading && (
              <Puff height="24px" style={{ marginRight: "5px" }} width="24px" />
            )}

            {process === PROCESS.FILL && "Confirm"}
            {process === PROCESS.GENERATE_ID && "Deposit"}
            {process === PROCESS.DEPOSIT && "Sign"}
            {process === PROCESS.CONFIRM && "Completed"}
          </button>
        )}
      </ButtonContainer>
    </>
  )
}

export default Confirm
