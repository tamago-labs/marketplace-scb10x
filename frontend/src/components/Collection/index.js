import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import ParticleBackground from "react-particle-backgrounds";
import NFTCard from "../nftCard";
import useOrder from "../../hooks/useOrder";
import { resolveNetworkName } from "../../helper";
import { Button as MoreButton } from "../../components/buttons";
import { AssetDetailsContainer } from "../OrderDetails/index";
import useCoingecko from "../../hooks/useCoingecko";

/** Styled Component */
const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
`;
const NftNameBoard = styled.div`
  background: rgb(238, 174, 202);
  background: radial-gradient(
    circle,
    rgba(238, 174, 202, 1) 0%,
    rgba(148, 187, 233, 1) 100%
  );
  color: #7a0bc0;
  border-radius: 12px;
  padding: 2rem 1rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;
const RoundImg = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50%;
  width: 100px;
  height: 100px;
`;

const BoardDetail = styled.div`
  text-align: center;
  padding: 0px 15px;
  width: 150px;

  h6 {
    font-weight: 600;
  }
  p {
    margin-bottom: 0px;
  }
`;

const CollectionName = styled.div`
  margin-left: auto;
  margin-right: auto;
  font-size: 20px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const Switcher = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: transparent;
  padding: 5px 30px;
  color: white;
  border: 1px solid white;

  :disabled {
    background-color: grey;
  }
  :first-child {
    border-right: 0px;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
  :last-child {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  ${(props) =>
    props.active &&
    `
  background: white;
  color: #333;
  
  `}
`;

const Jumbotron = styled(AssetDetailsContainer)``;

/** CONSTANT */
const MAX_ITEMS = 4;

/** Component */
const Collection = () => {
  const [max, setMax] = useState(MAX_ITEMS);
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState();
  const [isNew, setIsNew] = useState(false);
  const [isSold, setIsSold] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [isAll, setIsAll] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [lowestPrice, setLowestPrice] = useState();
  const { address } = useParams();
  const { getOrdersByCollection, resolveMetadata } = useOrder();
  const { getLowestPrice } = useCoingecko();

  useEffect(() => {
    address && getOrdersByCollection(address).then(setOrders);
    address && getOrdersByCollection(address).then(setAllOrders);
  }, [address]);

  useEffect(() => {
    address && getLowestPrice(allOrders).then(setLowestPrice);
  }, [allOrders]);

  useEffect(() => {
    if (orders.length !== 0) {
      resolveMetadata({
        assetAddress: orders[0].baseAssetAddress,
        tokenId: orders[0].baseAssetTokenId,
        chainId: orders[0].chainId,
      }).then((data) => {
        setData({
          ...data,
          chainId: orders[0].chainId,
        });
      });
    }
  }, [orders]);

  const sellers = useMemo(() => {
    if (allOrders && allOrders.length > 0) {
      return allOrders.reduce((arr, item) => {
        if (arr.indexOf(item.ownerAddress) === -1) {
          arr.push(item.ownerAddress);
        }
        return arr;
      }, []);
    }
    return [];
  }, [allOrders]);

  const handleFilter = (event) => {
    let filteredArr;
    switch (event.target.value) {
      case "all":
        setIsAll(true);
        setIsNew(false);
        setIsSold(false);
        setIsCanceled(false);
        setOrders(allOrders);
        break;
      case "new":
        setIsAll(false);
        setIsNew(true);
        setIsSold(false);
        setIsCanceled(false);
        filteredArr = allOrders.filter(
          (order) => order.canceled === false && order.fulfilled === undefined
        );
        setOrders(filteredArr);
        break;
      case "sold":
        setIsAll(false);
        setIsNew(false);
        setIsSold(true);
        setIsCanceled(false);
        filteredArr = allOrders.filter(
          (order) => order.fulfilled === true && order.canceled === false
        );
        setOrders(filteredArr);
        break;
      case "cancel":
        setIsAll(false);
        setIsNew(false);
        setIsSold(false);
        setIsCanceled(true);
        filteredArr = allOrders.filter((order) => order.canceled === true);
        setOrders(filteredArr);
        break;

      default:
        break;
    }
  };

  const settings = {
    particle: {
      particleCount: 150,
      color: "#fff",
      maxSize: 2,
    },
    velocity: {
      directionAngle: 180,
      directionAngleVariance: 60,
      minSpeed: 0.1,
      maxSpeed: 0.3,
    },
    opacity: {
      minOpacity: 0,
      maxOpacity: 0.4,
      opacityTransitionTime: 10000,
    },
  };

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

  return (
    <Container>
      <div>
        <Jumbotron color={data && data.chainId && resolveColor(data.chainId)}>
          <ParticleBackground
            style={{ position: "absolute", zIndex: 1 }}
            settings={settings}
          />
          <div style={{ textAlign: "center" }}>
            {data ? (
              <RoundImg src={data.metadata.image} />
            ) : (
              <Skeleton height="100px" width="100px" />
            )}
            {data ? (
              <CollectionName>{data.metadata.name}</CollectionName>
            ) : (
              <Skeleton
                style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                height="20px"
                width="80px"
              />
            )}
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <BoardDetail>
              <h6>Floor Price</h6>
              <p>$ {Number(lowestPrice).toLocaleString()}</p>
            </BoardDetail>
            <BoardDetail>
              <h6>Chain</h6>
              <p>
                {data && data.chainId ? resolveNetworkName(data.chainId) : "--"}
              </p>
            </BoardDetail>
            <BoardDetail>
              <h6>Sellers</h6>
              <p>{sellers.length}</p>
            </BoardDetail>
          </div>
        </Jumbotron>

        <Switcher>
          <Button value="all" active={isAll} onClick={(e) => handleFilter(e)}>
            All
          </Button>
          <Button value="new" active={isNew} onClick={(e) => handleFilter(e)}>
            New
          </Button>
          <Button value="sold" active={isSold} onClick={(e) => handleFilter(e)}>
            Sold
          </Button>
          <Button
            value="cancel"
            active={isCanceled}
            onClick={(e) => handleFilter(e)}
          >
            Cancel
          </Button>
        </Switcher>

        <ListContainer>
          {orders.length === 0 && <>No Item</>}

          {orders.length > 0 &&
            orders.map((order, index) => {
              if (index > max - 1) {
                return;
              }
              return (
                <NFTCard key={index} delay={index % MAX_ITEMS} order={order} />
              );
            })}
        </ListContainer>

        <div
          style={{ padding: "20px", marginTop: "1rem", textAlign: "center" }}
        >
          {orders.length > max && (
            <MoreButton onClick={() => setMax(max + 4)}>More...</MoreButton>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Collection;
