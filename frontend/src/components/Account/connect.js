import React, { useState, useEffect, useCallback, useContext } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { Connectors } from "../../config/connectors.js"
import useEagerConnect from "../../hooks/useEagerConnect"
import useInactiveListener from "../../hooks/useInactiveListener"

const ConnectPanelWrapper = styled.div`
    padding: 60px 20px 60px 20px;
    border: 1px solid white; 
    .title {
        text-align: center;
        margin-bottom: 2rem;
        max-width: 500px;
        margin-left: auto;
        font-size: 24px;
        font-weight: 600;
        margin-right: auto;
    }
    >p {
        margin-top: 2rem;
        text-align: center;
        font-size: 14px;
    }
`

const Connector = styled.div`
    border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  color: #fff;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;


  font-size: 24px;

  :hover {
    cursor: pointer;
    color: #444;
    background: white;
    box-shadow: none;
  }

  display: flex;
  flex-direction: row;

  img {
    width: 32px;
    height: 32px;
  }

  div {
    display: flex;
    align-items: center;

    :first-child {
      flex: 1;
      align-items: center;
    }
    :last-child {
        flex: 3;
    }
  }
`

const ConnectPanel = () => {

    const context = useWeb3React()

    const { account, activate, deactivate, error, chainId } = context

    const [errorMessage, setErrorMessage] = useState()

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState()

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect()

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

    useEffect(() => {
        if (error && error.name === "UnsupportedChainIdError") {
            setErrorMessage("Not support chain!")
        } else {
            setErrorMessage("")
        }
    }, [error])

    return (
        <ConnectPanelWrapper>
            <div className="title">💪Connect with one of available wallet providers </div>

            {Connectors.map((item, index) => {
                const { connector, name, imgSrc } = item
                return (
                    <Connector
                        key={index}
                        onClick={() => {
                            setActivatingConnector(connector)
                            activate(connector)
                        }}
                    >
                        <div>
                            <img src={imgSrc} alt={`wallet-icon-${index}`} />
                        </div>
                        <div>{name}</div>
                    </Connector>
                )
            })}

            {errorMessage && (
                <div style={{ fontSize: "14px", color: "red", fontWeight: "600", textAlign: "center", marginTop: "1rem" }}>
                    {errorMessage}
                </div>
            )}
            <p>We currently support following networks:</p>

            <table style={{ maxWidth: "600px", marginLeft: "auto", marginRight: "auto", color: "white" }} className="table">
                <thead>
                    <tr>
                        <td width={"40%"}> </td>
                        <td width={"60%"}>Chains</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Ethereum</td>
                        <td>Mainnet, Kovan Testnet</td> 
                    </tr>
                    <tr>
                        <td>Polygon</td>
                        <td>Mainnet, Mumbai Testnet</td> 

                    </tr>
                    <tr>
                        <td>BNB Smart Chain</td>
                        <td>Mainnet, Testnet</td>

                    </tr>
                    <tr>
                        <td>Avalanche</td>
                        <td>Mainnet, Fuji Testnet</td>
                    </tr>
                </tbody>
            </table>

            <p>Make sure you're connect to the right network</p>

        </ConnectPanelWrapper>
    )
}

export default ConnectPanel