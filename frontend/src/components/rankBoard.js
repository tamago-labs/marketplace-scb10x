import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import useOrder from "../hooks/useOrder";

import { shortAddress } from "../helper";

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

`;

const Row = styled.div`
     
    display: flex;
    overflow-y: auto;
    
    div {
      flex: 1;
      text-align: left;
       padding: 10px;
    }
`

const RankTable = styled(Table)`
  color: #fff; 
`

const TH = styled.th.attrs(() => ({ width: "15%" }))`

`


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
`

const RankBoard = () => {

  const [sellers, setSellers] = useState([])
  const [collections, setCollections] = useState([])

  const { getTopSellers, getTopCollections } = useOrder()

  useEffect(() => {
    getTopCollections().then(setCollections)
    getTopSellers().then(setSellers)
  }, [])

  return (
    <Container>
      <Row>
        <div>
          <h4>Top Collections</h4>
          <RankTable>
            <tbody>
              {collections.map((item, index) => {
                if (index >= 5) {
                  return
                }
                return (
                  <TR key={`collection-${index}`}>
                    <TH>
                      #{index + 1}
                    </TH>
                    <td>
                      <Link to={`/orders/collection/${item.address}`}>
                        {shortAddress(item.address, 10, -6)}
                      </Link>
                    </td>
                    <td>
                      {item.activeCount}{` `}Items
                    </td>
                  </TR>
                )
              })

              }
            </tbody>

          </RankTable>
        </div>
        <div  >
          <h4>Top Sellers</h4>
          <RankTable>

            <tbody>
              {sellers.map((item, index) => {
                if (index >= 5) {
                  return
                }
                return (
                  <TR key={`seller-${index}`}>
                    <TH>
                      #{index + 1}
                    </TH>
                    <td>
                      <Link to={`/orders/owner/${item.address}`}>
                        {shortAddress(item.address, 10, -6)}
                      </Link>

                    </td>
                    <td>
                      {item.activeSellCount}{` `}Items
                    </td>
                  </TR>
                )
              })

              }

            </tbody>
          </RankTable>
        </div>
      </Row>
    </Container>
  );
};

export default RankBoard;
