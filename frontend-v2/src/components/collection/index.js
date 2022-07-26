import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import useOrder from "../../hooks/useOrder";
import NFTCard from "../nftCard";
import { Button, Button2, ToggleButton } from "../../components/button"
import { AssetCard } from "../card";

const ALT_COVER = "https://img.tamago.finance/bg-2.jpg"

const Container = styled.div`
    margin-top: 1rem;
`

const Header = styled.div`
    position: relative;
    height: 150px; 
`

const Cover = styled.div`
    position: absolute;
    height: 150px;
    top: 0px;
    left: 0px;
    width: 100%;
    background: #CBC3E3;
`

const Image = styled.img`
    width: 100%;
    height: 150px;
    object-fit: cover;
`

const CollectionStatusContainer = styled.div`
    position: absolute;
    height: 60px;
    bottom: -20px;
    left: 0px;
    width: 100%;
    display: flex;
`

const CollectionStatusCard = styled.div`
    background: white;
    width: 800px;
    height: 60px;

    border-radius: 6px;
    padding: 16px;
    margin-left: auto;
    margin-right: auto;
    color: black;
    line-height: 18px;
    display: flex;
    padding: 12px;
    box-shadow: 5px 7px black;
`


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
    flex-grow:1;
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


const Body = styled.div.attrs(() => ({}))`
    margin-top: 3rem;
    display: flex;
    flex-direction: row;
`

const CollectionInfoCol = styled.div`
    flex: 3;
    padding: 10px;
`

const CollectionInfoCard = styled.div`
    background: white; 
    min-height: 300px;

    border-radius: 6px;
    padding: 16px; 
    color: black;
    line-height: 18px;
    display: flex;
    flex-direction: column;
    padding: 12px;
    box-shadow: 5px 7px black;
    h5 {
        margin-bottom: 10px;
    }
    p {
        font-size: 12px;
    }
`

const OrdersPanel = styled.div`
    display: flex;
    flex-wrap: wrap;  
    padding-top: 10px;
`


const CollectionOrderCol = styled.div`
    flex: 9;
`


const MAX_ITEMS = 8;

const Collection = () => {

    const [max, setMax] = useState(MAX_ITEMS);

    const { address, chain } = useParams()

    const { getOrdersFromCollection, getCollectionInfo } = useOrder()
    const [orders, setOrders] = useState([])
    const [info, setInfo] = useState()

    useEffect(() => {
        if (chain) {
            setOrders([])
            setMax(MAX_ITEMS)
            getOrdersFromCollection(Number(chain), address).then(setOrders)
            getCollectionInfo(address, Number(chain)).then(setInfo)
        }

    }, [chain, address])



    return (
        <Container>
            <Header>
                <Cover>
                    <Image src={info && info.cover ? info.cover  : ALT_COVER} />
                </Cover>
                <CollectionStatusContainer>
                    <CollectionStatusCard>
                        <Info
                            name="Items"
                            value={info && info.totalSupply}
                        />
                        {/* <Info
                            name="Owners"
                            value={info && info.totalOwners}
                        /> */}
                        <Info
                            name="Listing"
                            value={orders ? orders.length : null}
                        />
                        {/* <Info
                            name="Total Volume"
                            value={null}
                        /> */}
                        <Info
                            name="Floor Price"
                            value={null}
                        />
                    </CollectionStatusCard>
                </CollectionStatusContainer>
            </Header>
            <Body>
                <CollectionInfoCol>
                    <CollectionInfoCard>
                        <h5>{info && info.title ? info.title : <Skeleton />}</h5>
                        <p>{info && info.description ? info.description : <Skeleton />}</p>
                    </CollectionInfoCard>
                </CollectionInfoCol>
                <CollectionOrderCol>
                    <OrdersPanel>

                        {(!orders || orders.length === 0) && <AssetCard />}

                        {(orders.length > 0) &&
                            orders.map((order, index) => {
                                if (index > max - 1) {
                                    return;
                                }
                                return (
                                    <NFTCard key={index} delay={index % MAX_ITEMS} order={order} />
                                );
                            })}

                    </OrdersPanel>
                    <div style={{ padding: "20px", marginTop: "1rem", textAlign: "center" }}>
                        {orders.length > max && (
                            <Button onClick={() => setMax(max + 4)}>View More Items...</Button>
                        )}
                    </div>
                </CollectionOrderCol>
            </Body>

        </Container>
    )
}

export default Collection