import React, { useState, useEffect, useCallback, useContext } from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { useWeb3React } from "@web3-react/core"
import styled from "styled-components"
import { X, Check } from "react-feather"
import { Puff } from 'react-loading-icons'
import { resolveNetworkName } from "../../helper"


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

const TableContainer = styled.div`
 
  margin-left: auto;
  margin-right: auto; 

  .table {
     font-size: 14px;
  }
`


const CrosschainSwapModal = ({ loading, toggle, visible, process = 0, order, item, onPartialSwap, onClaim }) => {

    const { chainId } = useWeb3React()

    return (
        <Modal style={{ top: '10%' }} isOpen={visible} toggle={toggle}>
            <Header toggle={toggle}>
                {`Swap from ${resolveNetworkName(item.chainId)} <-> ${resolveNetworkName(order.chainId)}`}
                <CloseIcon onClick={toggle} />
            </Header>

            <ModalBody>
                <p
                    style={{ textAlign: "center", color: "grey", fontSize: "12px", lineHeight: "16px" }}
                >You must complete 3 steps below in order to swap your NFT / tokens across the chain</p>
                {(process === 3 && order.chainId !== chainId) && (
                    <p style={{ fontSize: "12px", color: "red", textAlign: "center"  }}>
                        Please switch to {resolveNetworkName(order.chainId)}
                    </p>
                )}
                <TableContainer>
                    <table className="table">

                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Deposit your NFT/tokens at {resolveNetworkName(item.chainId)} chain</td>
                                <td>{process > 1 ? <Check /> : <X />}</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Wait for the validator to approve requests</td>
                                <td>{process > 2 ? <Check /> : <X />}</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Claim your NFT at {resolveNetworkName(order.chainId)} chain</td>
                                <td>{process > 3 ? <Check /> : <X />}</td>
                            </tr>
                        </tbody>
                    </table>
                </TableContainer>
                
            </ModalBody>

            <ModalFooter style={{ display: "flex" }}>
                <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                    {process === 1 &&
                        <Button onClick={onPartialSwap} disabled={loading} color='primary'>
                            {loading && (
                                <Puff height="24px" style={{ marginRight: "5px" }} width="24px" />
                            )}Deposit
                        </Button>
                    }
                    {process === 2 &&
                        <Button disabled color='warning'>
                            <Puff height="24px" style={{ marginRight: "5px" }} width="24px" color="black" />
                            Waiting
                        </Button>
                    }
                    {process === 3 &&
                        <Button onClick={onClaim} disabled={loading} color='success'>
                            {loading && (
                                <Puff height="24px" style={{ marginRight: "5px" }} width="24px" />
                            )}
                            Claim
                        </Button>
                    }
                    {process === 4 &&
                        <Button disabled color='secondary'>
                            Completed
                        </Button>
                    }

                </div>

            </ModalFooter>

        </Modal>
    )
}

export default CrosschainSwapModal