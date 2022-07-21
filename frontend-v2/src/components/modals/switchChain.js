import React, { useState, useEffect, useCallback, useContext } from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { useWeb3React } from "@web3-react/core"
import styled from "styled-components"
import { X } from "react-feather"
import { NETWORK } from "../../config/network"

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
    background-image: linear-gradient(
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0)
      ),
      linear-gradient(101deg, #78e4ff, #ff48fa);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: none;
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

  const { account, chainId, library } = context

  return (
    <Modal style={{ top: '10%' }} isOpen={modalVisible} toggle={toggleModal}>
      <Header toggle={toggleModal}>
        Select Chain
        <CloseIcon onClick={toggleModal} />
      </Header>
      <ModalBody>
        <div className="row">
          {NETWORK.map((data, index) => (
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
                <div style={{ height: 30, width: 30, borderRadius: "50%" }}>
                  <img src={data.icon} />
                </div>
                <div className="--chain-name">
                  {data.chainName}
                </div>
              </Connector>
            </ConnectorWrapper>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default WalletsModal
