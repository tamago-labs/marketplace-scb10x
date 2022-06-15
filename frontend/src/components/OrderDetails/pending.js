import Skeleton from "react-loading-skeleton"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core";
import { Puff } from "react-loading-icons";
import { toast } from 'react-toastify';
import useOrder from "../../hooks/useOrder";
import { resolveNetworkName } from "../../helper"
import useProof from "../../hooks/useProof"
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { PairAssetCard } from "../cards";

const Wrapper = styled.div.attrs(() => ({ className: "container" }))`
     
`

const L1Text = styled.div.attrs(() => ({ className: "name" }))` 
`

const ClaimButton = styled.button.attrs(() => ({
    className: "btn shadow",
}))`
    color: #7a0bc0;
    background: #ffffff; 
    font-weight: 600;
    border-radius: 32px;
    margin-top: 12px;
    width: 100%;
    cursor: pointer;
    :hover {
      color: #ffffff;
      background: #fa58b6;
    } 
  `;

const Panel = styled.div`
    max-width: 600px;
    border:1px solid white;
    margin-left: auto;
    margin-right: auto;
    padding: 20px;
    min-height: 125px;
    text-align: center;
    display: flex;
    flex-direction: column;
    h4 {
        font-size: 20px;
        margin-bottom: 1rem;
    }
    margin-bottom: 2rem;
`

const shorterName = (name) => {
    return name.length > 28 ? `${name.slice(0, 15)}...${name.slice(-4)}` : name;
};

const Pending = ({
    activities,
    orderId,
    order
}) => {

    const { account, chainId } = useWeb3React()

    const { resolveMetadata, claimSeller } = useOrder();
    const [data, setData] = useState();
    const [item, setItem] = useState()
    const [loading, setLoading] = useState(false);

    const activity = activities.find(item => item.type === "claim")

    const { getMyClaim } = useProof()

    useEffect(() => {
        orderId && activity && getMyClaim(orderId, activity.buyer).then(setItem)
    }, [orderId, activity])

    useEffect(() => {
        if (item && item.tokenType !== 0) {
            resolveMetadata({
                assetAddress: item.assetAddress,
                tokenId: item.assetTokenIdOrAmount,
                chainId: item.chainId,
            }).then(setData);
        }

        return () => {
            setData();
        };
    }, [item]);

    const onClaim = useCallback(async () => {
        setLoading(true);

        try {
            await claimSeller(order, item.chainId);

            toast.success("Claimed!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                progress: undefined,
            });

        } catch (e) {
            const message = e.error && e.error.data && e.error.data.message ? e.error.data.message : e.message

            toast.error(`${message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                progress: undefined,
            });
        }

        setLoading(false);
    }, [order, orderId, item, claimSeller]);

    const isClaimed = item && item.claimed ? true : false

    return (
        <Wrapper>
            <Panel>
                <h4>
                    You have pending claim of
                </h4>
                <div style={{ marginLeft: "auto", marginRight: "auto" }}>

                    <PairAssetCard
                        chainId={item && item.chainId}
                        image={data && data.metadata.image}
                        assetAddress={item && item.assetAddress}
                        tokenId={item && item.assetTokenIdOrAmount}
                        isERC20={item && item.tokenType === 0}
                    >
                        {item && item.tokenType !== 0 && (
                            <>
                                <L1Text>
                                    {data ? (
                                        `${shorterName(data.metadata.name)} #${shorterName(
                                            item.assetTokenIdOrAmount
                                        )} `
                                    ) : (
                                        <Skeleton height="16px" />
                                    )}
                                </L1Text>
                            </>
                        )}

                        {item && item.tokenType === 0 && (
                            <>
                                <L1Text>
                                    {" "}
                                    {ethers.utils.formatUnits(
                                        item.assetTokenIdOrAmount,
                                        item.decimals
                                    )}
                                    {` `}
                                    {item.symbol}
                                </L1Text>
                            </>
                        )}
                        <>
                            <ClaimButton
                                disabled={loading || !account || isClaimed || (item && item.chainId !== chainId)}
                                onClick={onClaim}
                            >
                                {loading && (
                                    <Puff height="24px" style={{ marginRight: "5px" }} stroke="#7a0bc0" width="24px" />
                                )}
                                { isClaimed ? "Claimed" : "Claim"}
                            </ClaimButton>
                        </>

                        {!isClaimed && item && (item.chainId !== chainId) && (
                            <div>
                                <p
                                    style={{
                                        fontSize: "12px",
                                        color: "red",
                                        textAlign: "center",
                                        marginTop: "10px",
                                    }}
                                >
                                    Incorrect chain
                                </p>
                            </div>
                        )}
                    </PairAssetCard>
                </div>

            </Panel>
        </Wrapper>
    )
}

export default Pending