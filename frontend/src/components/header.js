import styled from "styled-components";
import { useState, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { Link } from "react-router-dom";
import { Badge } from "reactstrap";

import {
  shortAddress,
  resolveNetworkName,
  resolveNetworkIconUrl,
} from "../helper"
// import WalletsModal from "./Modal/WalletConnectModal"
import SwitchChainModal from "./Modal/SwitchChainModal"
import useEagerConnect from "../hooks/useEagerConnect"
import useInactiveListener from "../hooks/useInactiveListener"

const NetworkBadge = styled(({ className, toggleSwitchChain, chainId }) => {
  return (
    <div className={className}>
      <a
        className={`btn btn-custom text-primary shadow mr-2`}
        onClick={toggleSwitchChain}
      >
        <div className="image-container">
          <img
            style={{ height: "100%" }}
            src={resolveNetworkIconUrl(chainId)}
          />
        </div>
        <span style={{ color: "#7A0BC0" }} className="ml-4">
          {resolveNetworkName(chainId)}
        </span>
      </a>
    </div>
  );
})`
  position: relative;

  a {
    display: flex;
    align-items: center;
    border-radius: 32px;
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

  > .btn-custom {
    background-color: #fff;
  }

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const Navbar = styled.div.attrs(() => ({
  className: "container",
}))`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
`;

const StyledBadge = styled(Badge)`
  @media only screen and (max-width: 1000px) {
    display: none;
  }
`;

const ConnectWalletButton = styled(Link).attrs(() => ({ className: "btn btn-primary shadow", to: "/account" }))`
  z-index: 10;
  color: white;
  background-image: linear-gradient(to right, #f55f8d 0, #f8ae56 51%, #f55f8d 100%);
  border-radius: 32px;
  padding: 12px;

`

const Wrapper = styled.header.attrs(() => ({ className: "site-header mo-left header-transparent" }))`
   
`

const MobileHidden = styled.span`
@media only screen and (max-width: 1000px) {
  display: none;
}
`

const Menu = styled.div`

  a {
    color: inherit;
    text-decoration: none;
    :hover {
      text-decoration: underline;
    }
  }

@media only screen and (max-width: 1000px) {
  display: none;
}
`

function Header() {
  const { account, chainId, library } = useWeb3React();


  const [switchChainVisible, setSwitchChainVisible] = useState(false)

  const toggleSwitchChain = () => setSwitchChainVisible(!switchChainVisible)

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  return (
    <>
      {/* <WalletsModal
        toggleWalletConnect={toggleWalletConnect}
        walletLoginVisible={walletLoginVisible}
      /> */}
      <SwitchChainModal
        toggleModal={toggleSwitchChain}
        modalVisible={switchChainVisible}
      />
      <Wrapper>
        {/* <!-- Main Header --> */}
        <div className="sticky-header main-bar-wraper navbar-expand-lg">
          <div className="d-flex">
            <Navbar>
              {/* <!-- Website Logo --> */}
              <div
                className="logo-header mostion logo-dark"
                style={{
                  width: "225px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Link to="/">
                  <img
                    src="/images/logo.svg"
                    alt="logo"
                    width="225px"
                    height="45px"
                  />
                </Link>
                <div style={{ marginLeft: "10px", display: "flex" }}>
                  <StyledBadge style={{ marginTop: "auto", marginBottom: "auto" }} color="warning">
                    Testnet
                  </StyledBadge>
                </div>
              </div>

              <Menu>
                <Link to="/faucet">
                  <MobileHidden>Testnet</MobileHidden>{` `}Faucet
                </Link>
                {` `}|{` `}
                <Link to="/createOrder">
                  Create Order
                </Link>
                {` `}|{` `}
                <a target="_blank" href="https://docs.tamago.finance/tamago-finance/multi-chain-marketplace">
                  Docs
                </a>
              </Menu>

              {/* <!-- Extra Nav --> */}
              <div
                className="extra-nav"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {
                  <>
                    {!account ? (
                      <>
                        <ConnectWalletButton  >
                          Connect{` `}<MobileHidden>Wallet</MobileHidden>
                        </ConnectWalletButton>
                      </>
                    ) : (
                      <>
                        <NetworkBadge
                          chainId={chainId}
                          toggleSwitchChain={toggleSwitchChain}
                        />
                        <Link to="/account">
                          <a
                            style={{ color: "white", backgroundImage: "linear-gradient(to right, #f55f8d 0, #f8ae56 51%, #f55f8d 100%)", borderRadius: "32px", padding: 12 }}
                            className="btn btn-primary shadow mx-4"
                          >
                            {shortAddress(account)}
                          </a>
                        </Link>
                      </>
                    )}
                  </>
                }
              </div>
            </Navbar>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

export default Header;
