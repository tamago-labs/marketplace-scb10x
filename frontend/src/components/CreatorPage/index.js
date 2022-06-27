import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ParticleBackground from 'react-particle-backgrounds'
import NFTCard from "../nftCard";
import useOrder from "../../hooks/useOrder";
import { Button as MoreButton } from "../../components/buttons";
import BlankProfile from "../../images/blank_profile.webp";
import Skeleton from "react-loading-skeleton";

/** Styled Component */
const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
`;
const NftNameBoard = styled.div`
  background: rgb(34, 193, 195);
  background: linear-gradient(
    0deg,
    rgba(34, 193, 195, 1) 0%,
    rgba(253, 187, 45, 1) 100%
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

const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const SellerName = styled.div`
  margin-left: auto;
  margin-right: auto;
  font-size: 20px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
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

const Jumbotron = styled.div`

background: rgb(34, 193, 195);
background: linear-gradient(
  0deg,
  rgba(34, 193, 195, 1) 0%,
  rgba(253, 187, 45, 1) 100%
);

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
`

/** CONSTANT */
const MAX_ITEMS = 4;

const SortByOwner = () => {
  const [max, setMax] = useState(MAX_ITEMS);
  const [orders, setOrders] = useState([]);
  const [sellerName, setSellerName] = useState("");
  const { getOrdersByOwner, getOwnerName } = useOrder();
  const { ownerAddress } = useParams();
  const [isNew, setIsNew] = useState(false);
  const [isSold, setIsSold] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [isAll, setIsAll] = useState(true);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    ownerAddress && getOrdersByOwner(ownerAddress).then(setOrders);
    ownerAddress && getOrdersByOwner(ownerAddress).then(setAllOrders);
    ownerAddress && getOwnerName(ownerAddress).then(setSellerName);
  }, [ownerAddress]);

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

  const collections = useMemo(() => {
    if (allOrders && allOrders.length > 0) {
      return allOrders.reduce((arr, item) => {
        if (arr.indexOf(item.baseAssetAddress) === -1) {
          arr.push(item.baseAssetAddress);
        }
        return arr;
      }, []);
    }
    return [];
  }, [allOrders]);

  const settings = {
    particle: {
      particleCount: 100,
      color: "#fff",
      minSize: 2,
      maxSize: 4
    },
    velocity: {
      directionAngle: 0,
      directionAngleVariance: 30,
      minSpeed: 0.2,
      maxSpeed: 4
    },
    opacity: {
      minOpacity: 0,
      maxOpacity: 0.5,
      opacityTransitionTime: 5000
    }
  }

  return (
    <Container>
      <div>
        {/* <NftNameBoard>
          <div style={{ textAlign: "center" }}>
            <RoundImg src={BlankProfile} />

            {sellerName ? (
              <SellerName>@{sellerName}</SellerName>
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
              <h6>Items</h6>
              <p>{allOrders.length}</p>
            </BoardDetail>
            <BoardDetail>
              <h6>Collections</h6>
              <p>{collections.length}</p>
            </BoardDetail>
          </div>
        </NftNameBoard> */}
        <Jumbotron>
          <ParticleBackground style={{ position: "absolute", zIndex: 1 }} settings={settings} />
          <div style={{ textAlign: "center", zIndex: 10 }}>
            <RoundImg src={BlankProfile} />

            {sellerName ? (
              <SellerName>@{sellerName}</SellerName>
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
              <h6>All</h6>
              <p>{allOrders.length}</p>
            </BoardDetail>
            <BoardDetail>
              <h6>Collections</h6>
              <p>{collections.length}</p>
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

export default SortByOwner;
