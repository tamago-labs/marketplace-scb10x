import React, { useState, useEffect, useCallback, useContext } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { Connectors } from "../../config/connectors.js"
import useEagerConnect from "../../hooks/useEagerConnect"
import useInactiveListener from "../../hooks/useInactiveListener"

const ConnectPanelWrapper = styled.div`
    padding: 20px;
    >h4 {
        text-align: center;
        margin-bottom: 2rem;
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
            <h4>Connect with one of available wallet providers </h4>

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
            <p>We currently support Kovan, Mumbai.<br />Make sure you're connect to the right network.</p>

        </ConnectPanelWrapper>
    )
}

export default ConnectPanel