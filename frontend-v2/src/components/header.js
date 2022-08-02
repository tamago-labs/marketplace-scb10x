import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { useState, useContext } from "react";
import { ChevronDown } from "react-feather";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import useEagerConnect from "../hooks/useEagerConnect";
import SwitchChainModal from "../components/modals/switchChain";
import useInactiveListener from "../hooks/useInactiveListener";
import {
  shortAddress,
  resolveNetworkName,
  resolveNetworkIconUrl,
} from "../helper";
import { supportedChainIds } from "../config/connectors";
import WalletsModal from "./modals/wallets";
import CartModal from "./modals/cartModal";

const Container = styled.div.attrs(() => ({}))`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;

  a {
    color: inherit;
    margin-top: 10px;
    font-size: 14px;
  }
`;

const Brand = styled.div`
  padding: 10px;
  width: 300px;
  a {
    font-weight: 700;
    text-shadow: 3px 3px black;
    font-size: 20px;
    color: inherit;
    text-decoration: none;
  }
`;

const Menu = styled.div`
  margin: auto;

  @media only screen and (max-width: 600px) {
    text-align: center;
  }
`;

const Address = styled.div`
  font-size: 16px;
  padding: 10px 0px;
  font-weight: 600;
  text-shadow: 3px 3px black;
`;

const Buttons = styled.div`
  text-align: right;
  width: 300px;
`;

const NetworkBadge = styled(({ className, toggleSwitchChain, chainId }) => {
  return (
    <div className={className}>
      <Button onClick={toggleSwitchChain}>
        <div className="image-container">
          <img
            style={{ height: "100%" }}
            src={resolveNetworkIconUrl(chainId)}
          />
        </div>
        <div>{resolveNetworkName(chainId)}</div>
      </Button>
    </div>
  );
})`
  > button {
    display: flex;
    flex-direction: row;
    > div {
      margin: auto;
    }
    margin-right: 10px;

    .image-container {
      height: 30px;
      width: 30px;
      margin: auto;
    }
    margin-right: 10px;
  }

  .image-container {
    height: 30px;
    width: 30px;
    margin: auto;
    border-radius: 50%;
    overflow: hidden;
    transform: translateX(-20%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const Header = () => {
  const navigate = useNavigate();

  const [switchChainVisible, setSwitchChainVisible] = useState(false);
  const { account, chainId, library } = useWeb3React();

  const toggleSwitchChain = () => setSwitchChainVisible(!switchChainVisible);

  const [walletLoginVisible, setWalletLoginVisible] = useState(false);
  const [open, setOpen] = useState();

  const toggleWalletConnect = () => setWalletLoginVisible(!walletLoginVisible);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager);

  const isSupported = chainId && supportedChainIds.indexOf(chainId) !== -1;

  return (
    <>
      <WalletsModal
        toggleWalletConnect={toggleWalletConnect}
        walletLoginVisible={walletLoginVisible}
      />
      <SwitchChainModal
        toggleModal={toggleSwitchChain}
        modalVisible={switchChainVisible}
      />
      <Container>
        <Brand>
          <Link to="/">Tamago NFT</Link>
        </Brand>
        <Menu>
          {/* <Link to="/">
                        {` `}Marketplace
                    </Link>
                    {` `} */}
          <Link to="/launchpad">{` `}Launchpad</Link>
          {` `}
          <Link to="/faucet">{` `}Faucet</Link>
          {` `}
          {account && <Link to="/account">{` `}Account</Link>}
        </Menu>
        <Buttons>
          {!account && <Button onClick={toggleWalletConnect}>Connect</Button>}
          {account && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <NetworkBadge
                chainId={chainId}
                toggleSwitchChain={toggleSwitchChain}
              />
              {isSupported && (
                <Button onClick={() => navigate("/create")}>Sell</Button>
              )}
            </div>
          )}
        </Buttons>
        {account && <CartModal chainId={chainId} />}
      </Container>
    </>
  );
};

export default Header;
