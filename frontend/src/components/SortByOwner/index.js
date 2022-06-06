import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import NFTCard from "../nftCard";
import useOrder from "../../hooks/useOrder";
import { Button } from "../../components/buttons";

/** Styled Component */
const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
`;

/** CONSTANT */
const MAX_ITEMS = 4;

const SortByOwner = () => {
  const [max, setMax] = useState(MAX_ITEMS);
  const [orders, setOrders] = useState([]);
  const { getOrdersByOwner } = useOrder();
  let { ownerAddress } = useParams();

  useEffect(() => {
    ownerAddress && getOrdersByOwner(ownerAddress).then(setOrders);
  }, [ownerAddress, getOrdersByOwner]);

  return (
    <div style={{ marginTop: 32, paddingBottom: 32 }} className="container">
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

export default SortByOwner;
