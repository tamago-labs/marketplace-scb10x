
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useOrder from "../../hooks/useOrder"
import styled from "styled-components";
import { resolveNetworkName, shortAddress, resolveStatus } from "../../helper";
import AssetCard from "./assetCard";
import { AlertWarning } from "../alert";

const Container = styled.div.attrs(() => ({ className: "container" }))`
    margin-top: 2rem;
`

const Image = styled.img`
    width: 200px;
    height: 200px;
`

const Details = styled.div.attrs(() => ({ className: "col-sm-8" }))`
    display: flex;
    flex-direction: row;
    
    overflow: hidden;

    div {
        
 
    }

`


const Info = styled(
    ({ className, name, value }) => {
        return (
            <div className={className}>
                <label>{name}</label>
                <p>
                    {value}
                </p>
            </div>
        )
    })`
    display: inline-block; 
    min-width: 100px;
    text-align: left;
    label {
        padding: 0px;
        margin: 0px;
        font-weight: 600;
        color: var(--secondary);
        font-size: 14px;
    }
    margin-right: 10px;
    `

const HowTo = styled.div.attrs(() => ({ className: "col-sm-4" }))`
 

    .box {
        border: 1px solid white;
        padding: 20px;
        padding-top: 10px;
        min-height: 200px; 

        >h6 {
            text-decoration: underline;
        }

    }

`

const OrderDetails = () => {

    const { getOrder } = useOrder()

    const [order, setOrder] = useState()
    const [crossChain, setCrosschain] = useState(false)

    const { id } = useParams();

    useEffect(() => {

        id && getOrder(id).then(setOrder)

    }, [id, getOrder])

    console.log("order --> ", order)

    const items = useMemo(() => {

        if (order && order.barterList.length > 0) {
            return order.barterList.filter(item => crossChain ? item.chainId !== order.chainId : item.chainId === order.chainId)
        }

        return []

    }, [order, crossChain,])

    if (!order) {
        return (
            <Container>
                Loading...
            </Container>
        )
    }

    return (
        <Container>
            <div className="row">

                <Details>
                    <div>
                        <Image src="https://via.placeholder.com/400x400" />
                    </div>
                    <div style={{ marginLeft: "1rem", flexGrow: 1 }}>
                        <h4>
                            Baby Ape Mutant Club
                        </h4>
                        <p>
                            Wait for reveal
                        </p>
                        <div>
                            <Info
                                name={"Chain"}
                                value={resolveNetworkName(order.chainId)}
                            />
                            <Info
                                name={"Status"}
                                value={resolveStatus(order)}
                            />
                            {/* <Info
                                name={"Token Type"}
                                value={(order.baseAssetIs1155 ? "ERC-1155" : "ERC-721")}
                            /> */}
                            <Info
                                name={"Added By"}
                                value={shortAddress(order.ownerAddress)}
                            />
                            <p style={{ fontSize: "12px" }}>Contract Address : {order.baseAssetAddress}</p>
                        </div>
                    </div>
                </Details>
                <HowTo>
                    <div className="box">
                        <h6>How To Swap</h6>
                    </div>
                </HowTo>
            </div>

            <hr style={{ marginTop: "2rem", marginBottom: "2rem" }} />

            {/* CROSSCHAIN SWITCHER */}

            <div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <div onClick={() => setCrosschain(false)}>
                        <input type="radio" checked={!crossChain}
                        />
                        <label style={{ marginLeft: "10px" }}>Intra-chain</label>
                    </div>
                    <div onClick={() => setCrosschain(true)} style={{ marginLeft: "20px" }}>
                        <input type="radio" checked={crossChain} />
                        <label style={{ marginLeft: "10px" }} >Cross-chain</label>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: "1rem", marginBottom: "1rem", height: "40px" }}>

                {crossChain &&
                    <AlertWarning>
                        You would be facing delays of up to 10 minutes for cross-chain swaps
                    </AlertWarning>
                }
                {!crossChain &&
                    <AlertWarning>
                        Metamask/Web3 Wallet may popup twice for approving
                    </AlertWarning>
                }

            </div>

            {/* ITEMS */}

            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem", justifyContent: "center" }}>
                {items.map((item, index) => {
                    return (
                        <AssetCard crossChain={crossChain} item={item} key={index} />
                    )
                })

                }
            </div>

        </Container>
    )
}

export default OrderDetails