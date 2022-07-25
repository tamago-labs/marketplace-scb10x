import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { Container } from "reactstrap";
import { OptionsLarge } from "../input";
import { supportedChainIds } from "../../config/connectors";
import { resolveNetworkName } from "../../helper";
import { AssetCard, CollectionCard } from "../card";
import useOrder from "../../hooks/useOrder";
import { useEffect, useMemo, useState } from "react";
import { Button, ToggleButton } from "../../components/button";
import { Button as Button2 } from "reactstrap";
import { shorterName } from "../../helper";
import { ERC20_TOKENS } from "../../constants";
import Skeleton from "react-loading-skeleton";

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;

  button {
    font-size: 10px;
    margin-top: 10px;
    :not(:first-child) {
      margin-left: 10px;
    }
  }
`;

const StyledContainer = styled.div``;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const NetworkPanel = styled.div`
  text-align: center;
  padding: 1rem;
  padding-top: 0rem;
  padding-bottom: 0rem;
`;

const Description = styled.p`
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-size: 14px;
  padding: 1.5rem;
`;

const AllOrdersPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
`;

const CollectionsPanel = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
`;

const SearchSide = styled.div`
  flex: 3;
`;

const OrderSide = styled.div`
  flex: 9;
  @media only screen and (max-width: 1400px) {
    flex: 6;
  }
  @media only screen and (max-width: 1200px) {
    flex: 4;
  }
`;

const MAX_ITEMS = 8;

const NFTCard = ({ delay, order }) => {
  const { resolveMetadata, resolveTokenValue } = useOrder();
  const [data, setData] = useState();

  useEffect(() => {
    if (order && order.tokenType !== 0) {
      setTimeout(() => {
        resolveMetadata({
          assetAddress: order.assetAddress,
          tokenId: order.tokenId,
          chainId: order.chainId,
        }).then(setData);
      }, delay * 1000);
    }
  }, [order, delay]);

  return (
    <AssetCard
      orderId={order.cid}
      image={
        order.tokenType === 0
          ? "../images/coin.png"
          : data && data.metadata && data.metadata.image
      }
      chainId={order.chainId}
    >
      <div className="name">
        {order.tokenType !== 0 ? (
          <>
            {data && data.metadata && data.metadata.name}
            {` `}#{shorterName(order.tokenId)}
          </>
        ) : (
          <>
            {resolveTokenValue({
              assetAddress: order.assetAddress,
              tokenId: order.tokenId,
              chainId: order.chainId,
            })}
          </>
        )}
      </div>
    </AssetCard>
  );
};

const Info = styled(({ className, name, value }) => {
  return (
    <div className={className}>
      <label>{name}</label>
      <p>{value || <Skeleton />}</p>
    </div>
  );
})`
  display: inline-block;
  min-width: 100px;
  text-align: left;
  height: 50px;
  margin-top: auto;
  margin-bottom: auto;
  label {
    padding: 0px;
    margin: 0px;
    font-weight: 600;
    font-size: 14px;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  margin-right: 10px;
`;

const Collection = ({ orders, delay }) => {
  const { resolveMetadata } = useOrder();
  const [data, setData] = useState();

  useEffect(() => {
    if (orders && orders.length > 0) {
      setTimeout(() => {
        resolveMetadata({
          assetAddress: orders[0].assetAddress,
          tokenId: orders[0].tokenId,
          chainId: orders[0].chainId,
        }).then(setData);
      }, delay * 1000);
    }
  }, [orders]);

  const firstRow = orders && orders[0];
  const type = useMemo(() => {
    if (firstRow) {
      if (firstRow.tokenType === 0) {
        return "ERC-20";
      }
      return firstRow.tokenType === 1 ? "ERC-721" : "ERC-1155";
    }
    return "Unknown";
  }, [firstRow]);

  const tokenSymbol = useMemo(() => {
    if (firstRow && firstRow.tokenType === 0) {
      const token = ERC20_TOKENS.find(
        (item) =>
          item.contractAddress.toLowerCase() ===
            firstRow.assetAddress.toLowerCase() &&
          item.chainId === firstRow.chainId
      );
      return token && token.symbol;
    }
    return;
  }, [firstRow]);

  return (
    <CollectionCard>
      {firstRow && (
        <img
          style={{ height: "50px", marginRight: "20px" }}
          src={
            firstRow.tokenType === 0
              ? "../images/coin.png"
              : data && data.metadata && data.metadata.image
          }
          alt=""
        />
      )}

      <Info
        name="Collection Name"
        value={tokenSymbol ? tokenSymbol : data ? data.metadata.name : null}
      />
      <Info name="Type" value={type} />
      <Info name="Items" value={orders.length} />
    </CollectionCard>
  );
};

const Orders = () => {
  const [chain, setChain] = useState();
  const [showCollection, setShowCollection] = useState(false);
  const [orders, setOrders] = useState([]);
  const [collections, setCollections] = useState([]);

  const [max, setMax] = useState(MAX_ITEMS);

  const { getAllOrders } = useOrder();

  useEffect(() => {
    setTimeout(() => {
      if (localStorage.getItem("chainId")) {
        setChain(Number(localStorage.getItem("chainId")));
      } else {
        setChain(1);
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (chain) {
      setOrders([]);
      setMax(MAX_ITEMS);
      getAllOrders(chain).then(setOrders);
    }
  }, [chain]);

  useEffect(() => {
    const collections = orders.reduce((array, item) => {
      if (array.indexOf(item.assetAddress) === -1) {
        array.push(item.assetAddress);
      }
      return array;
    }, []);
    setCollections(collections);
  }, [orders]);

  const updateChain = (chainId) => {
    setChain(chainId);
    localStorage.setItem("chainId", `${chainId}`);
  };

  const updateShowCollection = (showing) => {
    setShowCollection(showing);
  };

  return (
    <StyledContainer>
      <Row>
        <SearchSide>
          <NetworkPanel>
            <ButtonGroup>
              <ToggleButton onClick={() => updateChain(1)} active={chain === 1}>
                Ethereum
              </ToggleButton>
              <ToggleButton
                onClick={() => updateChain(137)}
                active={chain === 137}
              >
                Polygon
              </ToggleButton>
              <ToggleButton
                onClick={() => updateChain(56)}
                active={chain === 56}
              >
                BNB
              </ToggleButton>
              <ToggleButton
                onClick={() => updateChain(43114)}
                active={chain === 43114}
              >
                Avalanche
              </ToggleButton>
            </ButtonGroup>
            <ButtonGroup>
              <ToggleButton
                onClick={() => updateChain(42)}
                active={chain === 42}
              >
                Kovan
              </ToggleButton>
              <ToggleButton
                onClick={() => updateChain(80001)}
                active={chain === 80001}
              >
                Mumbai
              </ToggleButton>
              <ToggleButton
                onClick={() => updateChain(97)}
                active={chain === 97}
              >
                BNB Testnet
              </ToggleButton>
              <ToggleButton
                onClick={() => updateChain(43113)}
                active={chain === 43113}
              >
                Fuji Testnet
              </ToggleButton>
            </ButtonGroup>
          </NetworkPanel>
        </SearchSide>
        <OrderSide>
          <ButtonGroup>
            <ToggleButton
              onClick={() => updateShowCollection(false)}
              active={showCollection === false}
            >
              NFTs
            </ToggleButton>
            <ToggleButton
              onClick={() => updateShowCollection(true)}
              active={showCollection === true}
            >
              Collections
            </ToggleButton>
          </ButtonGroup>
          {/* SHOW ORDERS */}
          {!showCollection && (
            <>
              <AllOrdersPanel>
                {(!orders || orders.length === 0) && <AssetCard />}

                {orders.length > 0 &&
                  orders.map((order, index) => {
                    if (index > max - 1) {
                      return;
                    }
                    return (
                      <NFTCard
                        key={index}
                        delay={index % MAX_ITEMS}
                        order={order}
                      />
                    );
                  })}
              </AllOrdersPanel>
              <div
                style={{
                  padding: "20px",
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                {orders.length > max && (
                  <Button onClick={() => setMax(max + 8)}>More...</Button>
                )}
              </div>
            </>
          )}
          {/* SHOW COLLECTIONS */}
          {showCollection && (
            <>
              <CollectionsPanel>
                {collections.map((collectionAddress, index) => {
                  const collectionOrders = orders.filter(
                    (item) => item.assetAddress === collectionAddress
                  );
                  return (
                    <Collection
                      key={index}
                      delay={index}
                      orders={collectionOrders}
                    >
                      {collectionAddress}
                    </Collection>
                  );
                })}
              </CollectionsPanel>
            </>
          )}
        </OrderSide>
      </Row>
    </StyledContainer>
  );
};

export default Orders;
