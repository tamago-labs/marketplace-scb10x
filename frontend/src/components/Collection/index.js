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
background: rgb(238,174,202);
background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
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
`

const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 1rem;
  margin-bottom: 2rem; 
`

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
  }, [address]);

  useEffect(() => {
    if (orders.length !== 0) {
      resolveMetadata({
        assetAddress: orders[0].baseAssetAddress,
        tokenId: orders[0].baseAssetTokenId,
        chainId: orders[0].chainId,
      }).then(setData);
    }
  }, [orders]);

  const sellers = useMemo(() => {
    if (orders && orders.length > 0) {
      return orders.reduce(( arr, item ) => {
        if (arr.indexOf(item.ownerAddress) === -1) {
          arr.push(item.ownerAddress)
        }
        return arr
      },[])
    }
    return []
  },[orders])

  

  return (
    <Container>
      <div>
        <NftNameBoard>
          <div style={{ textAlign: "center" }}>
            {data ? (
              <RoundImg src={data.metadata.image} />
            ) : (
              <Skeleton height="100px" width="100px" />
            )}
            {data ? (
              <CollectionName>{data.metadata.name}</CollectionName>
            ) : (
              <Skeleton style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} height="20px" width="80px" />
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
              <h6>Sellers</h6>
              <p>{sellers.length}</p>
            </BoardDetail>
            {/* <BoardDetail>
              <h6>Floor Price</h6>
              <p>-</p>
            </BoardDetail>
            <BoardDetail>
              <h6>Chain</h6>
              <p>Kovan/Mumbai</p>
            </BoardDetail> */}
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
    </Container>
  );
};

export default Collection;
