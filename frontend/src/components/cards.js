
import { useState } from "react"
import styled from "styled-components"
import Skeleton from "react-loading-skeleton"
import { Badge } from "reactstrap"
import { MoreVertical } from "react-feather"
import { resolveBlockexplorerLink, resolveNetworkName } from "../helper"

const AssetCardContainer = styled.div`
    background-color: rgba(38, 38, 38, 0.6);
    width: 260px;
    min-height: 380px;
    border-radius: 12px;
    padding: 12px; 
    border: 1px solid transparent;
    margin-left: 3px;
    margin-right: 3px;
    margin-bottom: 10px;

    .name {
        color: #fff;
        margin-top: 12px;
    }

`

const BaseAssetCardContainer = styled(AssetCardContainer)`
 
    &:hover {
        border: 1px solid pink;
    }

`

const PreviewContainer = styled.div`
    height: 220px;
    overflow: hidden;
    position: relative;

`

const Image = styled.img`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 220px;
`

const ChainInfo = styled.div`
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: 10; 
    width: 100%; 
    display: flex;
    background: blue;
    height: 20px;
    div {
        margin-left: auto;
        margin-right: auto;
        font-size: 12px;
        color: white;
    }
`

const ChainBadge = styled(Badge).attrs(() => ({ color: "success" }))`
    margin-left: auto;
    margin-right: auto;

`



const MoreInfo = styled(
    ({ className, chainId, assetAddress }) => {

        const [menuVisible, setMenuVisible] = useState(false)

        const blockExplorerLink = resolveBlockexplorerLink(chainId, assetAddress)

        return (
            <div className={className}>
                <button onClick={() => setMenuVisible(!menuVisible)}>
                    <MoreVertical color="white" />
                </button>
                {menuVisible && (
                    <div className="--menu">
                        <a href={blockExplorerLink} target="_blank" className="--menu-item">
                            Asset Address
                        </a>
                    </div>
                )
                }
            </div>
        )
    })`
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
    width: 50%;
    text-align: right;

    button {
        border-radius: 50%;
        background: blue;
        padding: 3px;
        border: 0px; 
    }

    .--menu {  
        margin-top: 5px;
        position: absolute;
        background: blue;
        right: -2px;
        padding: 5px;
        z-index: 20;
        font-size: 12px;
        width: 100%; 
        .--menu-item { 
            color: inherit;
            cursor: pointer;
            text-decoration: none;
            :hover {
                text-decoration: underline;
            }
        }
    }

    `

export const BaseAssetCard = ({
    children,
    image,
    chainId,
    assetAddress,
    tokenId
}) => (
    <BaseAssetCardContainer>

        <PreviewContainer>
            {image ? <Image src={image} /> : <Skeleton height="220px" />}
            {chainId &&
                (
                    <ChainInfo>
                        <div>
                            {resolveNetworkName(chainId)}
                        </div>
                    </ChainInfo>
                )
            }
            <MoreInfo
                chainId={chainId}
                assetAddress={assetAddress}
                tokenId={tokenId}
            />
        </PreviewContainer>


        {children}
    </BaseAssetCardContainer>
)


export const PairAssetCard = ({
    children,
    image,
    chainId,
    assetAddress,
    tokenId,
    isERC20 = false
}) => (
    <AssetCardContainer>
        <PreviewContainer>
            { !isERC20 &&
            <>
            {(image ) ? <Image src={image} /> : <Skeleton height="220px" />}
            </>

            }
            
            {isERC20 &&
                <>
                    <div style={{ display: "flex", height: "220px", border: "1px solid blue" }}>
                        <div style={{ margin: "auto", fontSize: "24px" }}>
                            ERC-20
                        </div>
                    </div>
                </>
            }
            {chainId &&
                (
                    <ChainInfo>
                        <div>
                            {resolveNetworkName(chainId)}
                        </div>
                    </ChainInfo>
                )
            }
            <MoreInfo
                chainId={chainId}
                assetAddress={assetAddress}
                tokenId={tokenId}
            />
        </PreviewContainer>
        {children}
    </AssetCardContainer>
)