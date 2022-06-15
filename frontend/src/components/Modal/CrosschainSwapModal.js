import React, { useState, useEffect, useCallback, useContext, useId } from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { useWeb3React } from "@web3-react/core"
import styled from "styled-components"
import { X, Check, ArrowRight } from "react-feather"
import { Puff } from 'react-loading-icons'
import { resolveNetworkName } from "../../helper"
import useInterval from "../../hooks/useInterval"


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


const CountContainer = styled.div`
  text-align: center;
  font-size: 12px;
  color: blue;


`

const Preview = styled.div`
  display: flex;
  color: #333;
  div {
    flex: 1;
    width: 150px; 
    border-radius: 12px;
    padding: 12px; 
    border: 1px solid transparent;
    margin-left: 3px;
    margin-right: 3px;
    display: flex; 
  }
`

const Button = styled.button.attrs(() => ({ className: "btn" }))`
  color: #ffffff;
  background: #7a0bc0; 
  font-weight: 600;
  border-radius: 32px; 
  border: 2px solid transparent;
  width: 100%;
  max-width: 300px;
  cursor: pointer;
  
  :hover {
    color: #ffffff;
    background: #fa58b6;
  }
`


const CrosschainSwapModal = ({
    loading,
    toggle,
    visible,
    process = 0,
    order,
    item,
    onPartialSwap,
    onClaim,
    max,
    baseMetadata,
    pairMetadata,
    approved,
    onApprove
}) => {

    const { chainId } = useWeb3React()

    const [count, setCount] = useState(0)

    useInterval(() => {
        process === 2 ? setCount(count + 1) : setCount(0)
    }, 1000)

    return (
        <Modal style={{ top: '10%' }} isOpen={visible} toggle={toggle}>
            <Header toggle={toggle}>
                {`Swap Your Asset`}
                <CloseIcon onClick={toggle} />
            </Header>

            <ModalBody>

                <Preview>
                    <div>
                        {item && item.tokenType === 0 && (
                            <>
                                <div style={{ margin: "auto" }}>
                                    <h4 style={{ marginLeft: "auto", marginRight: "auto" }}>{item.symbol}</h4>
                                </div>
                            </>
                        )}
                        {pairMetadata && item.tokenType !== 0 && <img src={pairMetadata.metadata.image} width="100%" height="120px" style={{ margin: "auto" }} />}
                    </div>
                    <div>
                        <div style={{ margin: "auto", textAlign: "center" }}>
                            <ArrowRight style={{ marginLeft: "auto", marginRight: "auto" }} size={32} />
                        </div>
                    </div>
                    <div>
                        {baseMetadata && <img src={baseMetadata.metadata.image} width="100%" height="120px" style={{ margin: "auto" }} />}
                    </div>
                </Preview>
                <Preview>
                    <div style={{ fontSize: "14px", justifyContent: "center" }}>
                        {resolveNetworkName(item.chainId)}
                    </div>
                    <div>

                    </div>
                    <div style={{ fontSize: "14px", justifyContent: "center" }}>
                        {resolveNetworkName(order.chainId)}
                    </div>
                </Preview>
                <p style={{ color: "#333", marginTop: "1rem", marginBottom: "1rem", marginLeft: "auto", marginRight: "auto", textAlign: "center", fontSize: "12px", fontWeight: "600", letterSpacing: "-0.5px" }}>
                    You must complete 3 steps below in order to swap your NFT / tokens across the chain</p>


                {(process === 3 && order.chainId !== chainId) && (
                    <p style={{ fontSize: "12px", color: "red", textAlign: "center" }}>
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

                {process === 1 &&
                    <p style={{ color: "#333", marginTop: "1rem", marginBottom: "1rem", marginLeft: "auto", marginRight: "auto", textAlign: "center", fontSize: "12px", fontWeight: "600", letterSpacing: "-0.5px" }}>
                        Additional fees will be topped up at 1% of the price when using ERC-20 tokens to swap
                    </p>
                }

                {process >= 2 &&
                    <CountContainer style={{ marginTop: "5px" }}>
                        If you fail during step 2,3 when retry the step 1 will be waived
                    </CountContainer>

                }

                {process === 2 &&
                    <CountContainer>
                        (Elapsed : {`${count}s`} / Avg. : 100-300s)
                    </CountContainer>
                }

            </ModalBody>

            <ModalFooter style={{ display: "flex" }}>
                <div style={{ width: "100%", textAlign: "center" }}>
                    {process === 1 &&
                        (<>
                            {!approved
                                ?
                                <>
                                    <Button
                                        onClick={() => onApprove()}
                                        disabled={loading}
                                    >
                                        {loading && (
                                            <Puff height="24px" style={{ marginRight: "5px" }} stroke="white" width="24px" />
                                        )}
                                        Approve
                                    </Button>
                                </>
                                :
                                <>
                                    <Button onClick={onPartialSwap} disabled={loading}>
                                        {loading && (
                                            <Puff height="24px" style={{ marginRight: "5px" }} stroke="white" width="24px" />
                                        )}Deposit
                                    </Button>
                                </>
                            }</>)
                    }
                    {process === 2 &&
                        <Button disabled>
                            <Puff height="24px" style={{ marginRight: "5px" }} width="24px" stroke="white" />
                            Waiting
                        </Button>
                    }
                    {process === 3 &&
                        <Button onClick={onClaim} disabled={loading}>
                            {loading && (
                                <Puff height="24px" style={{ marginRight: "5px" }} stroke="white" width="24px" />
                            )}
                            Claim
                        </Button>
                    }
                    {process === 4 &&
                        <Button disabled>
                            Completed
                        </Button>
                    }

                </div>

            </ModalFooter>

        </Modal>
    )
}

export default CrosschainSwapModal