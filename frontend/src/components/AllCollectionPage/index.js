import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import useOrder from "../../hooks/useOrder";
import { ChevronsLeft } from "react-feather";
import { shortAddress } from "../../helper";

/* Styled Component */
const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 2rem;
  display: flex;
  max-width: 900px;

  min-height: 250px;

  div {
    flex: 1;
    text-align: left;
  }

  h4 {
    text-align: center;
    margin-bottom: 20px;
  }
`;

const RankTable = styled(Table)`
  color: #fff;
`;

const TH = styled.th.attrs(() => ({ width: "15%" }))``;

const TR = styled.tr.attrs(() => ({}))`
  td {
    a {
      color: inherit;
      text-decoration: none;
    }
    :last-child {
      text-align: right;
    }
  }
`;
const AllCollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const { getTopCollections } = useOrder();

  useEffect(() => {
    getTopCollections(100).then(setCollections);
  }, []);

  return (
    <Container>
      <div>
        <h4>Top Collections</h4>
        <RankTable>
          <tbody>
            {collections.map((item, index) => {
              if (index >= 5) {
                return;
              }
              return (
                <TR key={`collection-${index}`}>
                  <TH>#{index + 1}</TH>
                  <td>
                    <Link to={`/orders/collection/${item.address}`}>
                      {shortAddress(item.address, 10, -6)}
                    </Link>
                  </td>
                  <td>
                    {item.activeCount}
                    {` `}Items
                  </td>
                </TR>
              );
            })}
          </tbody>
        </RankTable>
        <Link to={`/`} style={{ color: "#ffff" }}>
          <ChevronsLeft />
          back
        </Link>
      </div>
    </Container>
  );
};

export default AllCollectionPage;
