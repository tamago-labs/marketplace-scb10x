import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import useOrder from "../../hooks/useOrder";
import { ChevronsLeft } from "react-feather";
import { shortAddress } from "../../helper";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

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
const AllSellerPage = () => {
  const [sellers, setSellers] = useState([]);
  const { getTopSellers } = useOrder();
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    getTopSellers(100).then(setSellers);

    if (sellers > 100) {
      //loop all
    }
  }, []);

  return (
    <Container>
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
                      {shortAddress(item.address, 10, -6)}
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
        <Link to={`/`} style={{ color: "#ffff" }}>
          <ChevronsLeft />
          back
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Pagination aria-label="Page navigation example">
            <PaginationItem disabled>
              <PaginationLink first href="#" />
            </PaginationItem>
            <PaginationItem disabled>
              <PaginationLink href="#" previous />
            </PaginationItem>

            <PaginationItem active>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#" next />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" last />
            </PaginationItem>
          </Pagination>
        </div>
      </div>
    </Container>
  );
};

export default AllSellerPage;
