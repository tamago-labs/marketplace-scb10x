import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { resolveNetworkName } from "../helper"
import useOrder from "../hooks/useOrder"
import Skeleton from "react-loading-skeleton"

const Container = styled.div`
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

const NFTCard = ({ order, id }) => {

  const { resolveMetadata } = useOrder()
  const [data, setData] = useState()

  useEffect(() => {

    if (order) {

      setTimeout(() => {
        resolveMetadata({
          assetAddress: order.baseAssetAddress,
          tokenId: order.baseAssetTokenId,
          chainId: order.chainId
        }).then(setData)
      }, id * 3000)

    }

  }, [order, id])

  return (
    <Container>

      {data ? <img src={data.metadata && data.metadata.image ? data.metadata.image : "https://via.placeholder.com/200x200"} width="100%" height="220" />
        : <Skeleton height="220px" />
      }


      <div className="name">
        {data ? `${data.metadata.name} #${order.baseAssetTokenId} ` : <Skeleton height="16px"/>}
      </div>
      <div className="name">Chain: {resolveNetworkName(order.chainId)}</div>
      <a
        style={{
          color: "white",
          borderRadius: "32px",
          marginTop: "12px",
          width: "100%"
        }}
        className="btn btn-primary shadow"
      >
        Buy
      </a>
    </Container>
  )
}

export default NFTCard
