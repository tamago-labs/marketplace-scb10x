import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "react-bootstrap";
import { Badge } from "reactstrap"
import { Link } from "react-router-dom";
import useOrder from "../hooks/useOrder";
import { ChevronsRight } from "react-feather";
import { resolveNetworkName, shortAddress } from "../helper";
import Skeleton from "react-loading-skeleton";
import { MAINNET_CHAINS } from "../constants";

/* Styled Component */
const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 2rem;
  display: flex; 

  min-height: 250px;

  div {
    flex: 1;
    text-align: left;
  }
`;

const Row = styled.div`
  display: flex;
  overflow-y: auto;

  div {
    flex: 1;
    text-align: left;
    padding: 10px;
  }
`;

const RankTable = styled(Table)`
  color: #fff;
`;

const TH = styled.th.attrs(() => ({ width: "10%" }))``;

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

const Loading = () => {
  return (
    <>
      <Skeleton style={{ marginBottom: "4px" }} height="28px" />
      <Skeleton style={{ marginBottom: "4px" }} height="28px" />
      <Skeleton style={{ marginBottom: "4px" }} height="28px" />
      <Skeleton style={{ marginBottom: "4px" }} height="28px" />
      <Skeleton style={{ marginBottom: "26px" }} height="28px" />
    </>
  )
}

const RankBoard = ({
  isMainnet
}) => {
  const [sellers, setSellers] = useState([]);
  const [collections, setCollections] = useState([]);

  const { getTopSellers, getTopCollections } = useOrder();

  useEffect(() => {
    setCollections([])
    getTopCollections(isMainnet).then(setCollections);
    getTopSellers(5).then(setSellers);
  }, [isMainnet]);

  return (
    <Container>
      <Row>
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
                        {item.name || shortAddress(item.address, 10, -6)}
                      </Link>{` `}
                      <Badge color={MAINNET_CHAINS.includes(item.chainId) ? "primary" : "secondary"} >{resolveNetworkName(item.chainId)}</Badge>

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
          {(collections.length === 0) && <Loading />}
          <Link to={`/all-collection`} style={{ color: "#ffff" }}>
            Full List<ChevronsRight></ChevronsRight>{" "}
          </Link>
        </div>
        <div>
          <h4>Top Sellers</h4>
          <RankTable>
            <tbody>
              {sellers.map((item, index) => {
                if (index >= 5) {
                  return;
                }
                return (
                  <TR key={`seller-${index}`}>
                    <TH>#{index + 1}</TH>
                    <td>
                      <Link to={`/orders/owner/${item.address}`}>
                        {item.name ? `@${item.name}` : shortAddress(item.address, 10, -6)}
                      </Link>
                    </td>
                    <td>
                      {item.activeSellCount}
                      {` `}Items
                    </td>
                  </TR>
                );
              })}
            </tbody>
          </RankTable>
          {(sellers.length === 0) && <Loading />}
          <Link to={`/all-sellers`} style={{ color: "#ffff" }}>
            Full List<ChevronsRight></ChevronsRight>{" "}
          </Link>
        </div>
      </Row>
    </Container>
  );
};

export default RankBoard;
