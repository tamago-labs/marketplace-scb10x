import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import NFTCard from "../nftCard";
import useOrder from "../../hooks/useOrder";
import { Button } from "../../components/buttons";

/** Styled Component */
const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 2rem;
`;
const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
`;

/** CONSTANT */
const MAX_ITEMS = 4;
const ORDER_STATUS = {
  UNKNOWN: 0,
  NEW: 1,
  SOLD: 2,
};

/** Component */
const Collection = () => {
  const [max, setMax] = useState(MAX_ITEMS);
  const [orders, setOrders] = useState([]);

  const { getOrdersByCollection, resolveMetadata, resolveStatus } = useOrder();
  let { address } = useParams();

  useEffect(() => {
    address && getOrdersByCollection(address).then(setOrders);
  }, [address, getOrdersByCollection]);

  return (
    <div>
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

      <div style={{ padding: "20px", marginTop: "1rem", textAlign: "center" }}>
        {orders.length > max && (
          <Button onClick={() => setMax(max + 4)}>More...</Button>
        )}
      </div>
    </div>
  );
};

export default Collection;
