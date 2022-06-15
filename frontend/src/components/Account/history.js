import React, { useState, useEffect, useCallback, useContext } from "react"
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import { Table } from "react-bootstrap"
import { resolveNetworkName, shortAddress, resolveBlockexplorerLink } from "../../helper"


const Wrapper = styled.div.attrs(() => ({
    className: "rounded-md",
  }))`
    background: var(--secondary);
    min-height: 200px;
    margin-top: 1rem;
    padding: 20px;
  
    p {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  
    hr {
      background: white;
      margin-top: 2rem;
      margin-bottom: 2rem;
    }
  
    .error-message {
      margin-left: 10px;
      font-size: 14px;
      color: var(--danger);
    }
  `

const HistoryTable = styled(Table)`
  color: #fff; 
`

const ColWithLink = styled.th.attrs((props) => ({ onClick: () => props.navigate(`/order/${props.orderId}`) }))`
cursor: pointer;
:hover {
  text-decoration: underline;
}

`

const History = ({
    history
}) => {

    const navigate = useNavigate();

    return (
        <Wrapper>
            <HistoryTable>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Chain</th>
                        <th>Type</th>
                        <th>Transaction</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {history
                        ? history.map((data, index) => {

                            const txLink = resolveBlockexplorerLink(data.chainId, data.transaction, false)

                            return (
                                <tr key={index}>
                                    <ColWithLink navigate={navigate} orderId={data.orderId}>{data.orderId}</ColWithLink>
                                    <ColWithLink navigate={navigate} orderId={data.orderId}>{resolveNetworkName(data.chainId)}</ColWithLink>
                                    <ColWithLink navigate={navigate} orderId={data.orderId}>{data.type === "swap" ? "Swapped" : "Claimed (B)"}</ColWithLink>
                                    <th>
                                        <a style={{ color: "inherit", textDecoration: "none" }} target="_blank" href={txLink}>
                                            {shortAddress(data.transaction, 10, -6)}
                                        </a>

                                    </th>
                                    <ColWithLink navigate={navigate} orderId={data.orderId}>
                                    {(new Date(data.timestamp)).toLocaleString()}
                                    </ColWithLink>
                                </tr>
                            )
                        })
                        : ""}
                </tbody>
            </HistoryTable>
        </Wrapper>
    )
}

export default History