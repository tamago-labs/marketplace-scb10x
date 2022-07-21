import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { CollectionCard } from "../card"
import { ERC20_TOKENS } from "../../constants";
import useOrder from "../../hooks/useOrder";
import { resolveNetworkName, shortAddress } from "../../helper";

const Info = styled(({ className, name, value }) => {
    return (
        <div className={className}>
            <div>{name || <Skeleton />}</div>
            <p>{value || <Skeleton />}</p>
        </div>
    )
})`
    display: inline-block;
    min-width: 100px;
    text-align: left;
    height: 50px;
    margin-top: auto;
    margin-bottom: auto; 
    :not(:first-child) {
        flex-grow:1;
    }
    div {
      padding: 0px;
      margin: 0px;
      font-weight: 600; 
      font-size: 14px;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    margin-right: 10px;
  `


const Collection = ({
    orders,
    delay
}) => {

    const firstRow = orders && orders[0]
    // const type = useMemo(() => {
    //     if (firstRow) {
    //         if (firstRow.tokenType === 0) {
    //             return "ERC-20"
    //         }
    //         return (firstRow.tokenType === 1 ? "ERC-721" : "ERC-1155")
    //     }
    //     return "Unknown"
    // }, [firstRow])

    const tokenSymbol = useMemo(() => {
        if (firstRow && firstRow.tokenType === 0) {
            const token = ERC20_TOKENS.find(item => (item.contractAddress.toLowerCase() === firstRow.assetAddress.toLowerCase()) && (item.chainId === firstRow.chainId))
            return token && token.symbol
        }
        return
    }, [firstRow])

    if (orders.length === 0) {
        return (
            <CollectionCard
            >
                <Info
                    name={null}
                    value={null}
                />
                <Info
                    name={null}
                    value={null}
                />
                <Info
                    name={null}
                    value={null}
                />
            </CollectionCard>
        )
    }

    return (
        <CollectionCard
            address={firstRow && firstRow.assetAddress}
            chain={firstRow && (firstRow.chainId)}
        >
            <div>
                {` `}
            </div>
            {/* {firstRow && <img style={{ height: "50px", marginRight: "20px" }} src={firstRow.tokenType === 0 ? "../images/coin.png" : data && data.metadata && data.metadata.image} alt="" />} */}
            <Info
                name="Collection Name"
                value={tokenSymbol ? tokenSymbol : firstRow ? shortAddress(firstRow.assetAddress) : "Unknown"}
            />
            <Info
                name="Items"
                value={null}
            />
            <Info
                name="Owners"
                value={null}
            />
            <Info
                name="Listing"
                value={orders.length}
            />
            <Info
                name="Total Volume"
                value={null}
            />
            <Info
                name="Floor Price"
                value={null}
            />
        </CollectionCard>
    )
}

export default Collection