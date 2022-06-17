import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import NFTCard from "../nftCard";
import useOrder from "../../hooks/useOrder";
import { Button as MoreButton } from "../../components/buttons";
import BlankProfile from "../../images/blank_profile.webp";
import Skeleton from "react-loading-skeleton";
import { ButtonGroup, Button } from "reactstrap";

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

const StyleRadioButton = styled(Button)`
  background-color: #fa58b6;
  border-color: #fa58b6;

  :hover {
    background-color: #ffff;
    color: #fa58b6;
  }
`;

/** CONSTANT */
const MAX_ITEMS = 4;

const SortByOwner = () => {
  const [max, setMax] = useState(MAX_ITEMS);
  const [orders, setOrders] = useState([]);
  const [sellerName, setSellerName] = useState("");
  const { getOrdersByOwner, getOwnerName } = useOrder();
  const { ownerAddress } = useParams();

  useEffect(() => {
    ownerAddress && getOrdersByOwner(ownerAddress).then(setOrders);
    ownerAddress && getOwnerName(ownerAddress).then(setSellerName);

    console.log("🚀 ~ file: index.js ~ line 83 ~ SortByOwner ~ orders", orders);
    const networkNameSet = new Set();
  }, [ownerAddress]);

  const collections = useMemo(() => {
    if (orders && orders.length > 0) {
      return orders.reduce((arr, item) => {
        if (arr.indexOf(item.baseAssetAddress) === -1) {
          arr.push(item.baseAssetAddress);
        }
        return arr;
      }, []);
    }
    return [];
  }, [orders]);

  return (
    <Container>
      <div>
        <NftNameBoard>
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
              <p>{orders.length}</p>
            </BoardDetail>
            <BoardDetail>
              <h6>Collections</h6>
              <p>{collections.length}</p>
            </BoardDetail>
            {/* <BoardDetail>
              <h6>Traded</h6>
              <p>-</p>
            </BoardDetail>
            <BoardDetail>
              <h6>Fulfilled</h6>
              <p>-</p>
            </BoardDetail> */}
          </div>
        </NftNameBoard>
        <div>
          <h5>Radio Buttons</h5>
          <ButtonGroup>
            <StyleRadioButton
              color="primary"
              onClick={function noRefCheck() {}}
            >
              Kovan
            </StyleRadioButton>
            <StyleRadioButton
              color="primary"
              onClick={function noRefCheck() {}}
            >
              fiji
            </StyleRadioButton>
            <StyleRadioButton
              color="primary"
              onClick={function noRefCheck() {}}
            >
              Three
            </StyleRadioButton>
          </ButtonGroup>
        </div>
        <ListContainer>
          {orders.length === 0 && <>Loading...</>}

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
