
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AssetCard } from "./card";
import useOrder from "../hooks/useOrder";
import { shorterName } from "../helper" 

const NFTCard = ({
    delay,
    order
}) => {

    const { resolveMetadata, resolveTokenValue } = useOrder();
    const [data, setData] = useState();

    useEffect(() => {
        if (order && order.tokenType !== 0) {
            setTimeout(() => {
                resolveMetadata({
                    assetAddress: order.assetAddress,
                    tokenId: order.tokenId,
                    chainId: order.chainId,
                }).then(setData);
            }, delay * 1000);
        }

    }, [order, delay]);

    return (
        <AssetCard
            orderId={order.cid}
            image={order.tokenType === 0 ? "../../images/coin.png" : data && data.metadata && data.metadata.image}
            chainId={order.chainId}
        >
            <div className="name">
                {order.tokenType !== 0
                    ?
                    <>{data && data.metadata && data.metadata.name}{` `}#{shorterName(order.tokenId)}</>
                    :
                    <>
                        {resolveTokenValue({
                            assetAddress: order.assetAddress,
                            tokenId: order.tokenId,
                            chainId: order.chainId
                        })}
                    </>
                }
            </div>
        </AssetCard>
    )
}

export default NFTCard