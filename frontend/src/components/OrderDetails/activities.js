import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FileText } from "react-feather";
import { Tabs, Tab, Table } from "react-bootstrap"
import {
    resolveNetworkName,
    shortAddress,
    resolveBlockexplorerLink,
} from "../../helper";

const ActivitiesTable = styled(Table)`
color: #fff;
`


const Activities = ({
    chainId,
    orderId,
    activities
}) => {


    return (
        <div>
            <ActivitiesTable>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>From</th>
                        <th>Transaction</th>
                        <th>Timestamp</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {activities
                        ? activities.map((data, index) => {
 
                            const buyerLink = resolveBlockexplorerLink(data.chainId, data.buyer);
                            const txLink = resolveBlockexplorerLink(data.chainId, data.transaction, false)

                            return (
                                <tr key={index} >
                                    <th>
                                        #{index + 1}
                                    </th>
                                    <th>
                                        {data.type === "claim" ? (data.isOriginChain ? "Claimed (B)" : "Claimed (S)" ) : "Swapped"}
                                    </th>
                                    <th>
                                        <a style={{ color: "inherit", textDecoration: "none" }} target="_blank" href={buyerLink}>
                                            {shortAddress(data.buyer)}
                                        </a>
                                    </th>

                                    <th>
                                        <a style={{ color: "inherit", textDecoration: "none" }} target="_blank" href={txLink}>
                                            {shortAddress(data.transaction, 10, -6)}
                                        </a>

                                    </th>
                                    <th>
                                        {(new Date(data.timestamp)).toLocaleString()}
                                    </th>
                                    <th>

                                    </th>
                                </tr>
                            )
                        })
                        : ""}
                </tbody>
            </ActivitiesTable>
        </div>
    )
}

export default Activities