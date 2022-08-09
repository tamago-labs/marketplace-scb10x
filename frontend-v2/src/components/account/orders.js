import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Table } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { AssetCard } from "../card";
import NFTCard from "../nftCard";
import { TailSpin } from "react-loader-spinner";
import useOrder from "../../hooks/useOrder";
import { NFT_MARKETPLACE } from "../../constants";
import MarketplaceABI from "../../abi/marketplace.json";
import { SelectableCardCancelOrder } from "../card";

const LoadingSpinner = () => {
  return <TailSpin color="#fff" height={24} width={24} />;
};

const Wrapper = styled.div.attrs(() => ({
  className: "rounded-md",
}))`
  background: var(--secondary);
  min-height: 200px;
  margin-top: 1rem;

  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  hr {
    background: white;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .error-message {
    margin-left: 10px;
    font-size: 14px;
    color: var(--danger);
  }
`;

const OrderTable = styled(Table)`
  color: #fff;
`;

const TableRow = styled.tr`
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const ColWithLink = styled.th.attrs((props) => ({
  onClick: () => props.navigate(`/order/${props.orderId}`),
}))`
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const OrderItem = ({
  disabled,
  index,
  data,
  loading,
  onCancelOrder,
  onClaim,
  tick,
}) => {
  return (
    <div style={{ color: "black", textAlign: "center" }}>
      <button
        disabled={loading === Number(index)}
        onClick={() => onCancelOrder(data, index)}
        style={{
          zIndex: 40,
          color: "white",
          borderRadius: "32px",
          padding: "4px 8px",
        }}
        className="btn btn-danger shadow"
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          {loading === Number(index) && (
            <span style={{ marginRight: "10px" }}>
              <LoadingSpinner />
            </span>
          )}
          Cancel
        </div>
      </button>
    </div>
  );
};

const OrdersPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
`;

const Orders = () => {
  const [loading, setLoading] = useState(-1);
  const [orders, setOrders] = useState([]);
  const [tick, setTick] = useState(0);
  const [cancelData, setCancelData] = useState([]);

  const { getOrdersFromAccount } = useOrder();
  const { account, library, chainId } = useWeb3React();

  useEffect(() => {
    chainId &&
      account &&
      getOrdersFromAccount(chainId, account).then(setOrders);
  }, [account, chainId]);

  const onCancelOrder = useCallback(
    async (order, index) => {
      setLoading(Number(index));

      const { contractAddress } = NFT_MARKETPLACE.find(
        (item) => item.chainId === order.chainId
      );
      const marketplaceContract = new ethers.Contract(
        contractAddress,
        MarketplaceABI,
        library.getSigner()
      );

      try {
        const tx = await marketplaceContract.cancel(order.cid);
        await tx.wait();
      } catch (e) {
        console.log(e);
      } finally {
        getOrdersFromAccount(chainId, account).then(setOrders);
        setLoading(-1);
        setTick(tick + 1);
      }
    },
    [orders, chainId, account, tick]
  );

  const onClickCard = (nft) => {
    if (cancelData.find((data) => data.cid === nft.cid)) {
      const newNFTArray = cancelData.filter((data) => data.cid !== nft.cid);
      setCancelData(newNFTArray);
    } else {
      setCancelData([...cancelData, nft]);
    }
  };

  useEffect(() => {
    console.log(
      "🚀 ~ file: orders.js ~ line 152 ~ onClickCard ~ cancelData",
      cancelData
    );
  }, [cancelData]);

  return (
    <Wrapper>
      <OrdersPanel>
        {(!orders || orders.length === 0) && <AssetCard />}
        {orders.length > 0 &&
          orders.map((order, index) => {
            return (
              <div>
                <SelectableCardCancelOrder
                  chainId={chainId}
                  onClickCard={onClickCard}
                  order={order}
                  cancelData={cancelData}
                  account={account}
                />

                <NFTCard
                  key={index}
                  delay={index % orders.length}
                  order={order}
                >
                  <OrderItem
                    data={order}
                    index={index}
                    loading={loading}
                    onCancelOrder={onCancelOrder}
                    tick={tick}
                  />
                </NFTCard>
              </div>
            );
          })}
      </OrdersPanel>
    </Wrapper>
  );
};

export default Orders;
