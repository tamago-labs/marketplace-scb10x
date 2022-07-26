import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom"
import { CollectionCard } from "../card"
import { ERC20_TOKENS } from "../../constants";
import useOrder from "../../hooks/useOrder";
import { resolveNetworkName, shortAddress, shorterText } from "../../helper";

const Info = styled(({ className, name, value }) => {
    return (
        <div className={className}>
            <div>{name || <Skeleton />}</div>
            <p>{value || <Skeleton />}</p>
        </div>
    )
})`
    display: inline-block;
    text-align: left;
    height: 50px;
    min-width: 80px;
    margin-top: auto;
    margin-bottom: auto; 
    flex-grow: 1;
    font-size: 12px;

    div {
      padding: 0px;
      margin: 0px;
      font-weight: 600; 
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    margin-right: 10px;
  `


// const CollectionOLD = ({
//     orders,
//     delay
// }) => {

//     const firstRow = orders && orders[0]

//     const tokenSymbol = useMemo(() => {
//         if (firstRow && firstRow.tokenType === 0) {
//             const token = ERC20_TOKENS.find(item => (item.contractAddress.toLowerCase() === firstRow.assetAddress.toLowerCase()) && (item.chainId === firstRow.chainId))
//             return token && token.symbol
//         }
//         return
//     }, [firstRow])

//     if (orders.length === 0) {
//         return (
//             <CollectionCard
//             >
//                 <Info
//                     name={null}
//                     value={null}
//                 />
//                 <Info
//                     name={null}
//                     value={null}
//                 />
//                 <Info
//                     name={null}
//                     value={null}
//                 />
//             </CollectionCard>
//         )
//     }

//     return (
//         <CollectionCard
//             address={firstRow && firstRow.assetAddress}
//             chain={firstRow && (firstRow.chainId)}
//         >
//             <div>
//                 {` `}
//             </div>
//             <Info
//                 name="Collection Name"
//                 value={tokenSymbol ? tokenSymbol : firstRow ? shortAddress(firstRow.assetAddress) : "Unknown"}
//             />
//             <Info
//                 name="Items"
//                 value={null}
//             />
//             <Info
//                 name="Owners"
//                 value={null}
//             />
//             <Info
//                 name="Listing"
//                 value={orders.length}
//             />
//             <Info
//                 name="Total Volume"
//                 value={null}
//             />
//             <Info
//                 name="Floor Price"
//                 value={null}
//             />
//         </CollectionCard>
//     )
// }

const Card = styled.div`
    background: white; 
    height: 300px;
    overflow: hidden;
    border-radius: 6px;
    color: black;
    margin-top: 15px;
    line-height: 18px;
    display: flex;
    flex-direction: column;
    box-shadow: 5px 7px black;
    position: relative;
    cursor: pointer;

`

const CardCover = styled.div`
    position: absolute;
    height: 120px;
    top: 0px;
    left: 0px;
    width: 100%;
    background: #CBC3E3;
`

const CardBody = styled.div`
    position: absolute;
    height: 280px;
    top: 120px;
    left: 0px;
    width: 100%;
    padding: 10px;
    p {
        font-size: 12px;
        line-height: 16px;
    }
`

const Image = styled.img`
    width: 100%;
    height: 120px;
    object-fit: cover;
`

const ALT_COVER = "https://img.tamago.finance/bg-2.jpg"

const Collection = ({ orders, collection }) => {

    const firstRow = orders && orders[0]

    const  { getCollectionInfo } = useOrder()
    const [info, setInfo ] = useState()

    const address = firstRow && firstRow.assetAddress
    const chain = firstRow && (firstRow.chainId)

    const tokenSymbol = useMemo(() => {
        if (firstRow && firstRow.tokenType === 0) {
            const token = ERC20_TOKENS.find(item => (item.contractAddress.toLowerCase() === firstRow.assetAddress.toLowerCase()) && (item.chainId === firstRow.chainId))
            return token && token.symbol
        }
        return
    }, [firstRow])

    if (orders.length === 0) {
        return (
            <Skeleton
                height={300}
            />
        )
    }

    return (
        <Link to={`/collection/${chain}/${address}`}>
            <Card>
                <CardCover>
                    <Image src={ collection && collection.cover ? collection.cover  : ALT_COVER } />
                </CardCover>
                <CardBody>
                    <h5>{tokenSymbol ? tokenSymbol : collection && collection.title ? collection.title : shortAddress(address)}</h5>
                    <p>
                        { collection && collection.description ? shorterText(collection.description) : "" }
                    </p>
                    <Info   
                        name="Items"
                        value={collection && collection.totalSupply }
                    /> 
                    {/* <Info
                        name="Owners"
                        value={collection && collection.totalOwners}
                    /> */}
                    <Info
                        name="Listing"
                        value={orders.length}
                    />
                    {/* <Info
                        name="Total Volume"
                        value={null}
                    /> */}
                    <Info
                        name="Floor Price"
                        value={null}
                    />
                </CardBody>
            </Card>
        </Link>
    )
}

export default Collection