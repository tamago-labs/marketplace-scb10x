import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useOrder from "../../hooks/useOrder";
import styled from "styled-components";
import NFTCard from "../nftCard";
import { Button as MoreButton } from "../../components/buttons";

/** Styled Component */
const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 1rem;
  margin-bottom: 2rem;
`;
const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
`;

/** CONSTANT */
const MAX_ITEMS = 4;

/** Component */
const SearchPage = () => {
  const [max, setMax] = useState(MAX_ITEMS);
  const { query } = useParams();
  const { getCollectionsSearch } = useOrder();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    query && getCollectionsSearch(query).then(setOrders);
  }, [query]);

  return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <h2>search keyword = "{query}"</h2>
      </div>
      <ListContainer>
        {orders.length === 0 && <>No Item Found</>}

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
          <MoreButton onClick={() => setMax(max + 4)}>More...</MoreButton>
        )}
      </div>
    </Container>
  );
};

export default SearchPage;
