import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import NFTCard from "../nftCard";
import useOrder from "../../hooks/useOrder";
import { Button } from "../buttons";

/** Styled Component */
const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
`;
const NftNameBoard = styled.div`
  background: #ffff;
  color: #7a0bc0;
  border-radius: 20px;
  padding: 10px;
  height: 100%;
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

  h6 {
    font-weight: 600;
  }
  p {
    margin-bottom: 0px;
  }
`;

/** CONSTANT */
const MAX_ITEMS = 4;

/** Component */
const Collection = () => {
  const [max, setMax] = useState(MAX_ITEMS);
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState();
  const { getOrdersByCollection, resolveMetadata } = useOrder();
  const { address } = useParams();

  useEffect(() => {
    address && getOrdersByCollection(address).then(setOrders);
  }, [orders]);

  useEffect(() => {
    if (orders.length !== 0) {
      resolveMetadata({
        assetAddress: orders[0].baseAssetAddress,
        tokenId: orders[0].baseAssetTokenId,
        chainId: orders[0].chainId,
      }).then(setData);
    }
  }, [orders, resolveMetadata]);

  return (
    <div style={{ marginTop: 32, paddingBottom: 32 }} className="container">
      <div>
        <NftNameBoard>
          <div style={{ textAlign: "center" }}>
            {data ? (
              <RoundImg src={data.metadata.image} />
            ) : (
              <Skeleton height="100px" width="100px" />
            )}
            {data ? (
              <p>{data.metadata.name}</p>
            ) : (
              <Skeleton height="10px" width="20px" />
            )}
          </div>
          <div
            style={{
              position: "relative",
              left: "30px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <BoardDetail>
              <h6>Items</h6>
              <p>{orders.length}</p>
            </BoardDetail>
            <BoardDetail>
              <h6>Floor Price</h6>
              <p>-</p>
            </BoardDetail>
            <BoardDetail>
              <h6>Chain</h6>
              <p>Kovan/Mumbai</p>
            </BoardDetail>
          </div>
        </NftNameBoard>

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
            <Button onClick={() => setMax(max + 4)}>More...</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
