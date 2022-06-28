import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { FileText } from "react-feather";
import { Tabs, Tab, Table } from "react-bootstrap";
import ParticleBackground from "react-particle-backgrounds";
import useOrder from "../../hooks/useOrder";
import useOpenSea from "../../hooks/useOpenSea";
import {
  resolveNetworkName,
  shortAddress,
  resolveBlockexplorerLink,
} from "../../helper";
import AssetCard from "./assetCard";
import { AlertWarning, AlertError } from "../alert";
import Skeleton from "react-loading-skeleton";
import { useWeb3React } from "@web3-react/core";
import useActivities from "../../hooks/useActivities";
import Metadata from "./metadata";
import Activities from "./activities";
import Pending from "./pending";
import { Link } from "react-router-dom";

const AVALABLE_TESTNET_OPENSEA = ["Ropsten", "Rinksby", "Goerli", "Mumbai"];
const AVALABLE_MAINNET_OPENSEA = ["Polygon", "Ethereum"];

const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 2rem;
`;

const StyledTabs = styled(Tabs)`
  .nav-link {
    color: #fff;
  }
`;

export const ORDER_STATUS = {
  UNKNOWN: 0,
  NEW: 1,
  SOLD: 2,
  CANCELED: 3,
};

const shorterName = (name) => {
  return name.length > 28 ? `${name.slice(0, 15)}...${name.slice(-4)}` : name;
};

export const AssetDetailsContainer = styled.div.attrs(() => ({}))`
  ${(props) =>
    props.color === "purple" &&
    `
/* Created with https://www.css-gradient.com */
  background: #7602C1;
  background: -webkit-linear-gradient(top left, #7602C1, #DE96FF);
  background: -moz-linear-gradient(top left, #7602C1, #DE96FF);
  background: linear-gradient(to bottom right, #7602C1, #DE96FF);
`}

  ${(props) =>
    props.color === "red" &&
    `
/* Created with https://www.css-gradient.com */
background: #B8124C;
background: -webkit-linear-gradient(top left, #B8124C, #16B5B3);
background: -moz-linear-gradient(top left, #B8124C, #16B5B3);
background: linear-gradient(to bottom right, #B8124C, #16B5B3);
`}

${(props) =>
    props.color === "yellow" &&
    `
/* Created with https://www.css-gradient.com */
background: #D9A517;
background: -webkit-linear-gradient(bottom right, #D9A517, #5A2B15);
background: -moz-linear-gradient(bottom right, #D9A517, #5A2B15);
background: linear-gradient(to top left, #D9A517, #5A2B15);
`}

${(props) =>
    props.color === "blue" &&
    `
/* Created with https://www.css-gradient.com */
background: #5A34A8;
background: -webkit-linear-gradient(top left, #5A34A8, #1BCF9A);
background: -moz-linear-gradient(top left, #5A34A8, #1BCF9A);
background: linear-gradient(to bottom right, #5A34A8, #1BCF9A);
`}

${(props) =>
    props.color === "" &&
    `
/* Created with https://www.css-gradient.com */
background: #262626;
background: -webkit-linear-gradient(top left, #262626, #9B9B9B);
background: -moz-linear-gradient(top left, #262626, #9B9B9B);
background: linear-gradient(to bottom right, #262626, #9B9B9B);
`}

  padding: 1rem 2rem;
  margin-left: auto;
  margin-right: auto;
  color: white;
  font-weight: 600;
  border-radius: 12px;
  text-shadow: 1px 1px #333;
  position: relative;
  overflow: hidden;
  min-height: 235px;
  margin-bottom: 2rem;

  @media only screen and (max-width: 1000px) {
    padding: 1rem 2rem;
  }
`;

const AssetDetails = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  z-index: 10;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
`;

export const Info = styled(({ className, name, value, link }) => {
  return (
    <div className={className}>
      <label>{name}</label>
      {!link ? (
        <p>{value || <Skeleton width="80px" />}</p>
      ) : (
        <Link to={`/orders/owner/${link}`}>
          <p>{value}</p>
        </Link>
      )}
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
  a {
    color: inherit;
    text-decoration: none;
  }
  margin-right: 10px;
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

const OpenSeaLink = styled(({ className, chainId, assetAddress, tokenId }) => {
  const { getOpenSeaTestnetLink, getOpenSeaLink } = useOpenSea();

  const seaLink = useMemo(() => {
    const networkName = resolveNetworkName(chainId);

    if (!networkName) {
      return;
    }

    if (networkName && assetAddress && tokenId) {
      if (AVALABLE_TESTNET_OPENSEA.includes(networkName)) {
        return getOpenSeaTestnetLink(networkName, assetAddress, tokenId);
      } else if (AVALABLE_MAINNET_OPENSEA.includes(networkName)) {
        return getOpenSeaLink(networkName, assetAddress, tokenId);
      }
    }

    return;
  }, [chainId, assetAddress, tokenId]);

  return (
    <div className={className}>
      <a href={seaLink} target="_blank">
        <img
          style={{ width: "28px", opacity: !seaLink ? "0.63" : "1" }}
          src="/images/logo-opensea.png"
        />
      </a>
    </div>
  );
})`
  display: inline;
  > a {
    margin-left: 3px;
    padding-left: 2px;
    padding-right: 2px;
    padding-bottom: 2px;
    border: 0px;
  }
`;

const OrderDetails = () => {
  const { account, library } = useWeb3React();

  const { getOrder, resolveMetadata, resolveStatus, getOwnerName } = useOrder();

  const [order, setOrder] = useState();
  const [crossChain, setCrosschain] = useState(false);
  const [data, setData] = useState();
  const [status, setStatus] = useState(ORDER_STATUS.UNKNOWN);
  const [tick, setTick] = useState(0);
  const [sellerName, setSellerName] = useState();

  const [activities, setActivities] = useState();

  const { getActivitiesFromOrder } = useActivities();

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
  }, [order, tick]);

  useEffect(() => {
    if (order) {
      getActivitiesFromOrder(order.chainId, order.orderId).then(setActivities);
    }
  }, [order]);

  useEffect(() => {
    if (order) {
      const fetchOwnerName = async () => {
        const name = await getOwnerName(order.ownerAddress);
        setSellerName(`@${name}`);
      };
      fetchOwnerName();
    }
  }, [order]);

  const increaseTick = useCallback(() => {
    setTick(tick + 1);
  }, [tick]);

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

  const resolveColor = (chainId) => {
    switch (chainId) {
      case 80001:
        return "purple";
      case 137:
        return "purple";
      case 43113:
        return "red";
      case 43114:
        return "red";
      case 97:
        return "yellow";
      case 56:
        return "yellow";
      case 42:
        return "blue";
      case 1:
        return "blue";
      default:
        return "";
    }
  };

  const settings = {
    particle: {
      particleCount: 35,
      color: "#fff",
      minSize: 1,
      maxSize: 4,
    },
    velocity: {
      minSpeed: 0.2,
      maxSpeed: 0.4,
    },
    opacity: {
      minOpacity: 0,
      maxOpacity: 0.6,
      opacityTransitionTime: 10000,
    },
  };

  const isPendingClaim = useMemo(() => {
    if (order && activities && activities.length > 0) {
      if (
        order.ownerAddress.toLowerCase() === account.toLowerCase() &&
        activities.find((item) => item.type === "claim")
      ) {
        return true;
      }
    }
    return false;
  }, [activities, account, order]);

  if (!order) {
    return <Container>Loading...</Container>;
  }

  const sellerLink = resolveBlockexplorerLink(
    order.chainId,
    order.ownerAddress
  );

  return (
    <Container>
      <AssetDetailsContainer color={resolveColor(order.chainId)}>
        <ParticleBackground
          style={{ position: "absolute", zIndex: 1 }}
          settings={settings}
        />
        <AssetDetails>
          <div>
            {data ? (
              <Link to={`/orders/collection/${order.baseAssetAddress}`}>
                <Image
                  src={
                    data.metadata && data.metadata.image
                      ? data.metadata.image
                      : "https://via.placeholder.com/200x200"
                  }
                  width="100%"
                  height="220"
                />
              </Link>
            ) : (
              <Skeleton width="200px" height="200px" />
            )}
          </div>
          <div style={{ marginLeft: "2rem", flexGrow: 1 }}>
            <h4 style={{ fontSize: "22px" }}>
              {data ? (
                `${data.metadata.name} #${shorterName(order.baseAssetTokenId)} `
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
              {data && (
                <OpenSeaLink
                  chainId={order && order.chainId}
                  assetAddress={order && order.baseAssetAddress}
                  tokenId={order && order.baseAssetTokenId}
                />
              )}
            </h4>
            <p style={{ fontSize: "14px", lineHeight: "18px" }}>
              {data ? `${data.metadata.description} ` : <Skeleton />}
            </p>
            <div>
              <Info name={"Chain"} value={resolveNetworkName(order.chainId)} />
              <Info
                name={"Status"}
                value={
                  status === 0
                    ? null
                    : status === 2
                    ? "Sold"
                    : status === 3
                    ? "Canceled"
                    : "New"
                }
                color={status === 2 ? "red" : "white"}
              />
              <Info
                name={"Added By"}
                value={sellerName}
                link={order.ownerAddress}
              />
              <Info
                name={"Created"}
                value={new Date(
                  Number(order.timestamp) * 1000
                ).toLocaleString()}
              />
            </div>
          </div>
        </AssetDetails>
      </AssetDetailsContainer>

      {/* CROSSCHAIN SWITCHER */}

      {[2, 3].includes(status) && (
        <AlertError>
          Please be aware that the order is already fulfilled or canceled
        </AlertError>
      )}

      {isPendingClaim && (
        <Pending
          activities={activities}
          orderId={order && order.orderId}
          order={order}
        />
      )}

      {/* ITEMS */}
      <div
        style={{ maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}
      >
        <StyledTabs defaultActiveKey="swaps" className="mt-3 mb-3">
          <Tab eventKey="swaps" title="Assets to Swap">
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
            <div
              style={{
                marginTop: "1rem",
                marginBottom: "1rem",
                height: "40px",
              }}
            >
              {account && crossChain && (
                <div className="text-center">
                  You would be facing delays of up to 3 minutes for cross-chain
                  swaps
                </div>
              )}

              {!account && (
                <AlertWarning>Connect your wallet to continue</AlertWarning>
              )}
            </div>
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
                    baseMetadata={data}
                    increaseTick={increaseTick}
                  />
                );
              })}
            </div>
          </Tab>
          <Tab eventKey="activities" title="Activities">
            <Activities
              chainId={order.chainId}
              orderId={order.orderId}
              activities={activities}
            />
          </Tab>
          <Tab eventKey="metadata" title="Additional Info">
            <Metadata data={data} />
          </Tab>
        </StyledTabs>
      </div>
    </Container>
  );
};

export default OrderDetails;
