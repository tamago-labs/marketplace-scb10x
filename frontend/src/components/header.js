import styled from "styled-components"
import { useState, useContext } from "react"
import { useWeb3React } from "@web3-react/core"
import { Link } from "react-router-dom";

import {
  shortAddress,
  resolveNetworkName,
  resolveNetworkIconUrl,
} from "../helper"
import WalletsModal from "./Modal/WalletConnectModal"
import SwitchChainModal from "./Modal/SwitchChainModal"

const NetworkBadge = styled(({ className, toggleSwitchChain, chainId }) => {
  return (
    <div className={className}>
      <a
        className={`btn btn-custom text-primary shadow mr-2`}
        onClick={toggleSwitchChain}
      >
        <div className="image-container">
          <img style={{ height: "100%" }} src={resolveNetworkIconUrl(chainId)} />
        </div>
        <span className="ml-4">{resolveNetworkName(chainId)}</span>
      </a>
    </div>
  )
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
`

const Navbar = styled.div.attrs(() => ({
  className: "container",
}))`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
`

function Header() {
  const { account, chainId, library } = useWeb3React()

  const [walletLoginVisible, setWalletLoginVisible] = useState(false)
  const [switchChainVisible, setSwitchChainVisible] = useState(false)

  const toggleWalletConnect = () => setWalletLoginVisible(!walletLoginVisible)
  const toggleSwitchChain = () => setSwitchChainVisible(!switchChainVisible)

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
      <header className="site-header mo-left header-transparent">
        {/* <!-- Main Header --> */}
        <div className="sticky-header main-bar-wraper navbar-expand-lg">
          <div className="d-flex">
            <Navbar>
              {/* <!-- Website Logo --> */}
              <div
                className="logo-header mostion logo-dark"
                style={{ width: "225px" }}
              >
                <Link to="/">
                  <img
                    src="/images/logo.svg"
                    alt="logo"
                    width="225px"
                    height="45px"
                  />
                </Link>
              </div>
              {/* <!-- Extra Nav --> */}
              <div className="extra-nav" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                {
                  <>
                    {!account ? (
                      <a
                        style={{ zIndex: 10, color: "white", backgroundImage: "linear-gradient(to right, #f55f8d 0, #f8ae56 51%, #f55f8d 100%)", borderRadius: "32px", padding: 12 }}
                        className="btn btn-primary shadow"
                        onClick={toggleWalletConnect}
                      >
                        Connect Wallet
                      </a>
                    ) : (
                      <>
                        <NetworkBadge
                          chainId={chainId}
                          toggleSwitchChain={toggleSwitchChain}
                        />
                        <a
                          style={{ color: "white", backgroundImage: "linear-gradient(to right, #f55f8d 0, #f8ae56 51%, #f55f8d 100%)", borderRadius: "32px", padding: 12 }}
                          className="btn btn-primary shadow mx-4"
                        >
                          {shortAddress(account)}
                        </a>
                      </>
                    )}
                  </>
                }
              </div>
            </Navbar>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
