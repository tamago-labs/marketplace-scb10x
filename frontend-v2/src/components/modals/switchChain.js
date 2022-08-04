import React, { useState, useEffect, useCallback, useContext, useMemo } from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { useWeb3React } from "@web3-react/core"
import styled from "styled-components"
import { X } from "react-feather"
import { NETWORK } from "../../config/network"
import { TabContent, TabPane, Nav, NavItem, NavLink } from "../tabs"
import { MAINNET_CHAINS, TESTNET_CHAINS } from "../../constants"

const ConnectorWrapper = styled.div.attrs(() => ({ className: "col-6" }))`
  padding: 3px;
  display: flex;
`

const Connector = styled.div`

  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  margin: auto;
  color: #000;
  height: 100px;

  font-size: 20px;

  :hover {
    cursor: pointer;
    color: white;
    /* Created with https://www.css-gradient.com */
background: #C7A8F4;
background: -webkit-linear-gradient(top left, #C7A8F4, #9D6EE8);
background: -moz-linear-gradient(top left, #C7A8F4, #9D6EE8);
background: linear-gradient(to bottom right, #C7A8F4, #9D6EE8);
  }

  display: flex;
  flex-direction: column;

  img { 
    width: 36px;
    height: 36px;
    border-radius: 12px;
  }

  div {
    margin-left: auto;
    margin-right: auto;
  }

  .--chain-name {
    margin-top: 10px;
    font-size: 14px;
    max-width: 150px;
    text-align: center;
  }
`

const CloseIcon = styled(X)`
  cursor: pointer;
  position: absolute;
  right: 10px;
`

const Header = styled(ModalHeader)`
  color: #000;
  position: relative;

  button {
    display: none;
  }
`

function WalletsModal({ toggleModal, modalVisible }) {
  const context = useWeb3React()

  const [activeTab, setActiveTab] = useState("1");

  const { account, chainId, library } = context

  const toggle = (tab) => {
    setActiveTab(tab);
  };

  const availableNetworks = useMemo(() => { 
    return (NETWORK.filter((item) => {
      const CHAINS = activeTab === "1" ? MAINNET_CHAINS : TESTNET_CHAINS
      return CHAINS.indexOf(parseInt(item.chainId, 16)) !== -1
    })).sort(function (a, b) {
      return a.chainName - b.chainName;
    });
  }, [activeTab])

  return (
    <Modal style={{ top: '10%' }} isOpen={modalVisible} toggle={toggleModal}>
      <Header toggle={toggleModal}>
        Switch Chain
        <CloseIcon onClick={toggleModal} />
      </Header>
      <ModalBody>
        <div style={{ padding: "10px", color: "black" }} className="row">

          <Nav tabs>
            <NavItem>
              <NavLink
                active={activeTab === "1"}
                onClick={() => {
                  toggle("1");
                }}
              >
                Mainnet
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "2"}
                onClick={() => {
                  toggle("2");
                }}
              >
                Testnet
              </NavLink>
            </NavItem>
          </Nav>
          <div className="row" style={{ padding: "10px" }}>
            {availableNetworks.map((data, index) => (
              <ConnectorWrapper>
                <Connector
                  active={parseInt(data.chainId, 16) === parseInt(chainId)}
                  key={index}
                  onClick={async () => {
                    console.log(`Switching to chain `, data)
                    toggleModal()
                    const params = data

                    try {
                      await library?.send("wallet_switchEthereumChain", [
                        { chainId: data.chainId },
                        account,
                      ])
                    } catch (switchError) {
                      // This error code indicates that the chain has not been added to MetaMask.
                      if (switchError.code === 4902) {
                        try {
                          await library?.send("wallet_addEthereumChain", [
                            params,
                            account,
                          ])
                        } catch (addError) {
                          // handle "add" error
                          console.error(`Add chain error ${addError}`)
                        }
                      }
                      console.error(`Switch chain error ${switchError}`)
                      // handle other "switch" errors
                    }
                  }}
                >
                  <div style={{ height: 30, width: 30, borderRadius: "50%", marginTop :"auto", marginBottom : "auto" }}>
                    <img src={data.icon} />
                  </div>
                  <div className="--chain-name">
                    {data.chainName}
                  </div>
                </Connector>
              </ConnectorWrapper>
            ))}
          </div>

        </div>
      </ModalBody> 
    </Modal>
  )
}

export default WalletsModal
