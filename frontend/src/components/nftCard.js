import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import useOrder from "../hooks/useOrder";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { BaseAssetCard } from "./cards";
import { ethers } from "ethers";
import {
  shortAddress,
  resolveBlockexplorerLink,
  resolveNetworkName,
} from "../helper";

/* Styled Component */
const BuyButton = styled.a.attrs(() => ({
  className: "btn btn-primary shadow",
}))`
  color: #7a0bc0;
  background: #ffffff;
  font-weight: 600;
  border-radius: 32px;
  margin-top: 12px;
  width: 100%;
  cursor: pointer;
  :hover {
    color: #ffffff;
    background: #fa58b6;
  }
`;

const SecondaryDataRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const SellerCol = styled.div`
  flex: 1;
  a {
    color: inherit;
    text-decoration: none;
    :hover {
      text-decoration: underline;
    }
  }
`;

const PriceCol = styled.div`
  flex: 1;
  text-align: right;
`;

/* Component */
const NFTCard = ({ order, delay }) => {
  const { resolveMetadata } = useOrder();
  const [data, setData] = useState();

  useEffect(() => {
    if (order) {
      setTimeout(() => {
        resolveMetadata({
          assetAddress: order.baseAssetAddress,
          tokenId: order.baseAssetTokenId,
          chainId: order.chainId,
        }).then(setData);
      }, delay * 1000);
    }
  }, [order, delay]);

  const sellerLink = resolveBlockexplorerLink(
    order.chainId,
    order.ownerAddress
  );

  const price = useMemo(() => {
    if (order && order.barterList) {
      const anyToken = order.barterList.find((item) => item.tokenType === 0);
      if (anyToken) {
        return `${ethers.utils.formatUnits(
          anyToken.assetTokenIdOrAmount,
          anyToken.decimals
        )} ${anyToken.symbol}`;
      }
    }

    return;
  }, [order]);

  return (
    <BaseAssetCard
      image={data && data.metadata.image}
      chainId={order && order.chainId}
      assetAddress={order && order.baseAssetAddress}
      tokenId={order && order.baseAssetTokenId}
    >
      <Link to={`/orders/collection/${order.baseAssetAddress}`}>
        <div className="name">
          {data ? (
            `${data.metadata.name} #${order.baseAssetTokenId} `
          ) : (
            <Skeleton height="16px" />
          )}
        </div>
      </Link>
      {/* <div className="name">Chain: {resolveNetworkName(order.chainId)}</div> */}
      <SecondaryDataRow>
        <SellerCol>
          <Link to={`/orders/owner/${order.ownerAddress}`}>
            @{shortAddress(order.ownerAddress)}
          </Link>
        </SellerCol>
        {price && <PriceCol>{price}</PriceCol>}
      </SecondaryDataRow>
      <Link to={`/order/${order.orderId}`}>
        <BuyButton>Buy</BuyButton>
      </Link>
    </BaseAssetCard>
  );
};

export default NFTCard;
