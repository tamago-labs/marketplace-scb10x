import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FileText } from "react-feather";
import useOrder from "../../hooks/useOrder";
import {
  resolveNetworkName,
  shortAddress,
  resolveBlockexplorerLink,
} from "../../helper";
import AssetCard from "./assetCard";
import { AlertWarning } from "../alert";
import Skeleton from "react-loading-skeleton";
import { useWeb3React } from "@web3-react/core";

const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 2rem;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
`;

const Details = styled.div.attrs(() => ({ className: "col-sm-8" }))`
  display: flex;
  flex-direction: row;

  overflow: hidden;

  div {
  }
`;

const Info = styled(({ className, name, value }) => {
  return (
    <div className={className}>
      <label>{name}</label>
      <p>{value || <Skeleton width="80px" />}</p>
    </div>
  );
})`
  display: inline-block;
  min-width: 100px;
  text-align: left;
  label {
    padding: 0px;
    margin: 0px;
    font-weight: 600;
    color: var(--secondary);
    font-size: 14px;
  }
  margin-right: 10px;
`;

const Metadata = styled(({ className, metadata }) => {
  const { attributes } = metadata;

  return (
    <div className={`${className} col-sm-4`}>
      <h4>Attributes</h4>
      {attributes.map((attribute, index) => {
        return (
          <div className="--attribute" key={index}>
            <h4>{attribute["trait_type"]}</h4>
            <p> {attribute["value"]}</p>
          </div>
        );
      })}
    </div>
  );
})`
  h4 {
    font-size: 20px;
  }

  background: blue;
  padding: 20px;
  border-radius: 12px;
  display: block;

  .--attribute {
    border-radius: 12px;
    display: inline-block;
    margin-right: 2rem;
    text-align: left;
    > h4 {
      font-size: 16px;
    }
    > p {
      font-size: 14px;
    }
  }
`;

const SmartContractLink = styled(({ className, chainId, assetAddress }) => {
  const contractLink = resolveBlockexplorerLink(chainId, assetAddress);

  return (
    <div className={className}>
      <a href={contractLink} target="_blank">
        <FileText width={24} height={18} color="#fff" />
      </a>
    </div>
  );
})`
  display: inline;
  > a {
    background: #7a0bc0;
    border-radius: 50%;
    padding-left: 2px;
    padding-right: 2px;
    padding-bottom: 2px;
    border: 0px;
  }
`;

const ORDER_STATUS = {
  UNKNOWN: 0,
  NEW: 1,
  SOLD: 2,
};

const OrderDetails = () => {

  const { account, library } = useWeb3React();

  const { getOrder, resolveMetadata, resolveStatus } = useOrder()

  const [order, setOrder] = useState();
  const [crossChain, setCrosschain] = useState(false);
  const [data, setData] = useState();
  const [status, setStatus] = useState(ORDER_STATUS.UNKNOWN);

  const { id } = useParams();

  useEffect(() => {
    id && getOrder(id).then(setOrder);
  }, [id, getOrder]);

  useEffect(() => {
    if (order) {
      resolveMetadata({
        assetAddress: order.baseAssetAddress,
        tokenId: order.baseAssetTokenId,
        chainId: order.chainId,
      }).then(setData);

      resolveStatus({
        chainId: order.chainId,
        orderId: order.orderId,
      }).then(setStatus);
    }
  }, [order]);

  const items = useMemo(() => {
    if (order && order.barterList.length > 0) {
      const list = order.barterList.map((item, index) => {
        return {
          ...item,
          index,
        };
      });

      return list.filter((item) =>
        crossChain
          ? item.chainId !== order.chainId
          : item.chainId === order.chainId
      );
    }

    return [];
  }, [order, crossChain]);

  if (!order) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <div className="row">
        <Details>
          <div>
            {data ? (
              <Image
                src={
                  data.metadata && data.metadata.image
                    ? data.metadata.image
                    : "https://via.placeholder.com/200x200"
                }
                width="100%"
                height="220"
              />
            ) : (
              <Skeleton width="200px" height="220px" />
            )}
          </div>
          <div style={{ marginLeft: "2rem", flexGrow: 1 }}>
            <h4>
              {data ? (
                `${data.metadata.name} #${order.baseAssetTokenId} `
              ) : (
                <Skeleton />
              )}
              {` `}
              {data && (
                <SmartContractLink
                  chainId={order && order.chainId}
                  assetAddress={order && order.baseAssetAddress}
                />
              )}
            </h4>
            <p>{data ? `${data.metadata.description} ` : <Skeleton />}</p>
            <div>
              <Info name={"Chain"} value={resolveNetworkName(order.chainId)} />
              <Info
                name={"Status"}
                value={status === 0 ? null : status === 2 ? "Sold" : status === 3 ? "Canceled" : "New"}
                color={status === 2 ? "red" : "white"}
              />
              {/* <Info

    return (
        <Container>
            <div className="row">

                <Details>
                    <div>

                        {data ? <Image src={data.metadata && data.metadata.image ? data.metadata.image : "https://via.placeholder.com/200x200"} width="100%" height="220" />
                            : <Skeleton width="200px" height="220px" />
                        }

                    </div>
                    <div style={{ marginLeft: "2rem", flexGrow: 1 }}>
                        <h4>
                            {data ? `${data.metadata.name} #${order.baseAssetTokenId} ` : <Skeleton />}
                            {` `}
                            {data && <SmartContractLink
                                chainId={order && order.chainId}
                                assetAddress={order && order.baseAssetAddress}
                            />}
                        </h4>
                        <p>
                            {data ? `${data.metadata.description} ` : <Skeleton />}
                        </p>
                        <div>
                            <Info
                                name={"Chain"}
                                value={resolveNetworkName(order.chainId)}
                            />
                            <Info
                                name={"Status"}
                                value={status === 0 ? null : status === 2 ? "Sold" : status === 3 ? "Canceled" : "New"}
                                color={status === 2 ? "red" : "white"}
                            />
                            {/* <Info
                                name={"Token Type"}
                                value={(order.baseAssetIs1155 ? "ERC-1155" : "ERC-721")}
                            /> */}
              <Info
                name={"Created"}
                value={new Date(
                  Number(order.timestamp) * 1000
                ).toLocaleDateString()}
              />
              <Info
                name={"Added By"}
                value={shortAddress(order.ownerAddress)}
              />

              {/* <p style={{ fontSize: "12px" }}>Contract Address : {order.baseAssetAddress}</p> */}
            </div>
          </div>
        </Details>
        {/* <HowTo>
                    <div className="box">
                        <h6>How To Swap</h6>
                    </div>
                </HowTo> */}
        {/* {data ? <Metadata metadata={data.metadata} /> : <div className="col-sm-4"><Skeleton height="100%" /></div>} */}
      </div>

      <hr style={{ marginTop: "2rem", marginBottom: "2rem" }} />

      {/* CROSSCHAIN SWITCHER */}

      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div onClick={() => setCrosschain(false)}>
            <input type="radio" checked={!crossChain} />
            <label style={{ marginLeft: "10px" }}>Intra-chain</label>
          </div>
          <div
            onClick={() => setCrosschain(true)}
            style={{ marginLeft: "20px" }}
          >
            <input type="radio" checked={crossChain} />
            <label style={{ marginLeft: "10px" }}>Cross-chain</label>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1rem", marginBottom: "1rem", height: "40px" }}>
        {account && crossChain && (
          <AlertWarning>
            You would be facing delays of up to 3 minutes for cross-chain swaps
          </AlertWarning>
        )}

        {!account && (
          <AlertWarning>Connect your wallet to continue</AlertWarning>
        )}

        {/* {!crossChain &&
                    <AlertWarning>
                        Metamask/Web3 Wallet may popup twice for approving
                    </AlertWarning>
                } */}
      </div>

      {/* ITEMS */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "1rem",
          justifyContent: "center",
        }}
      >
        {items.map((item, index) => {
          return (
            <AssetCard
              id={index}
              order={order}
              crossChain={crossChain}
              item={item}
              key={index}
              account={account}
              library={library}
            />
          );
        })}
      </div>
    </Container>
  );
};

export default OrderDetails;
