import { useState, useEffect } from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import { Badge } from "reactstrap";
import { Link } from "react-router-dom";
import { MoreVertical, ChevronDown } from "react-feather";
import { resolveBlockexplorerLink, resolveNetworkName } from "../helper";
import useOpenSea from "../hooks/useOpenSea";

const AssetCardContainer = styled.div`
  background-color: #7a0bc0;
  width: 260px;
  min-height: 380px;
  border-radius: 20px;
  padding: 12px;
  border: 1px solid transparent;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 10px;
  filter: drop-shadow(12px 12px 10px rgba(0, 0, 0, 0.25));

  .name {
    color: #fff;
    margin-top: 12px;
  }
`;

const BaseAssetCardContainer = styled(AssetCardContainer)`
  &:hover {
    border: 1px solid pink;
  }
`;

const PreviewContainer = styled.div`
  height: 220px;
  overflow: visible;
  position: relative;
`;

const Image = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 220px;
  border-radius: 20px;
`;

const ChainInfo = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 10;
  width: 100%;
  display: flex;
  background: #fa58b6;
  height: 20px;
  border-radius: 0px 0px 20px 20px;
  div {
    margin-left: auto;
    margin-right: auto;
    font-size: 12px;
    color: white;
  }
`;

const ChainBadge = styled(Badge).attrs(() => ({ color: "success" }))`
  margin-left: auto;
  margin-right: auto;
`;

const MoreInfo = styled(({ className, chainId, assetAddress, isERC20 }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [link, setLink] = useState("");

  const blockExplorerLink = resolveBlockexplorerLink(chainId, assetAddress);
  const { getOpenSeaLink } = useOpenSea();

  useEffect(() => {
    setLink(getOpenSeaLink(resolveNetworkName(chainId), assetAddress));
  }, []);

  return (
    <div className={className}>
      <button onClick={() => setMenuVisible(!menuVisible)}>
        <MoreVertical color={!isERC20 ? "#7a0bc0" : "white"} border="" />
      </button>
      {menuVisible && (
        <div className="--menu">
          <div>
            <a href={blockExplorerLink} target="_blank" className="--menu-item">
              Contract Address
            </a>
          </div>
          <div>
            <a href={link} target="_blank" className="--menu-item">
              Open Sea
            </a>
          </div>
        </div>
      )}
    </div>
  );
})`
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
  width: 60%;
  text-align: right;

  button {
    border-radius: 50%;
    background: transparent;
    padding: 3px;
    border: 0px;
  }

  .--menu {
    margin-top: 5px;
    position: absolute;
    background: #7a0bc0;
    color: #ffff;
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
`;

export const BaseAssetCard = ({
  children,
  image,
  chainId,
  assetAddress,
  tokenId,
  orderId,
}) => (
  <BaseAssetCardContainer>
    <PreviewContainer>
      {image ? (
        <Link to={`/order/${orderId}`}>
          <Image src={image} />
        </Link>
      ) : (
        <Link to={`/order/${orderId}`}>
          <Skeleton height="220px" />
        </Link>
      )}
      {chainId && (
        <ChainInfo>
          <div>{resolveNetworkName(chainId)}</div>
        </ChainInfo>
      )}
      <MoreInfo
        chainId={chainId}
        assetAddress={assetAddress}
        tokenId={tokenId}
      />
    </PreviewContainer>

    {children}
  </BaseAssetCardContainer>
);

export const PairAssetCard = ({
  children,
  image,
  chainId,
  assetAddress,
  tokenId,
  isERC20 = false,
}) => (
  <AssetCardContainer>
    <PreviewContainer>
      {!isERC20 && (
        <>{image ? <Image src={image} /> : <Skeleton height="220px" />}</>
      )}

      {isERC20 && (
        <>
          <div
            style={{
              display: "flex",
              height: "220px",
              border: "1px solid #fa58b6",
              borderRadius: "20px",
            }}
          >
            <div style={{ margin: "auto", fontSize: "24px" }}>ERC-20</div>
          </div>
        </>
      )}
      {chainId && (
        <ChainInfo>
          <div>{resolveNetworkName(chainId)}</div>
        </ChainInfo>
      )}
      <MoreInfo
        chainId={chainId}
        assetAddress={assetAddress}
        tokenId={tokenId}
        isERC20={isERC20}
      />
    </PreviewContainer>
    {children}
  </AssetCardContainer>
);
