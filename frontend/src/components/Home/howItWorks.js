import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ArrowRight } from "react-feather"

const Container = styled.div`
    background-color: #7a0bc0;
    margin-top: 3rem;
    margin-bottom: 3rem;
    min-height: 280px; 
`

const InnerContainer = styled.div.attrs(() => ({ className: "container" }))`
    padding: 40px 20px;
    h2 {
        font-size: 26px;
        text-shadow: 1px 1px #333; 
        font-weight: 600;
    }
    
    @media only screen and (max-width: 600px) {
        h2 {
            font-size: 16px;
        }
        
    }

`

const Title = styled.div`
    display: flex;
    flex-direction: row;
    div {
        flex: 1;
        :last-child {
            text-align: right;
        }
    }

`

const ToggleText = styled.a`
    cursor: pointer;
    color: inherit;
    text-decoration: none;
    :hover {
        color: inherit;
    }
    opacity: ${props => props.active ? "1" : "0.6"};
`

const Steps = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px; 
    width: 100%;
    justify-content: center;
`

const Step = styled.div`
    border: 1px solid white;
    min-height: 140px;
    padding: 10px;
    width: 200px;
    border-radius: 12px;
    text-shadow: 1px 1px #333; 
    font-weight: 600;
    display: flex;
    text-align: center;
    font-size: 14px; 
    letter-spacing: -0.5px;
    div {
        margin: auto;
    }
`

const Arrow = styled(
    ({ className }) => {
        return (
            <div className={className}>
                <div>
                    <ArrowRight size={28} />
                </div>
            </div>
        )
    })`
    height: 140px;
    padding: 10px;
    display: flex;
    width: 60px;
    div {
        margin: auto;
    }

    `

const HowItWorks = () => {

    const [isSell, setSell] = useState(false)
    const [isCrossChain, setCrossChain] = useState(false)

    return (
        <Container>
            <InnerContainer>
                <Title>
                    <div>
                        <h2>How To <ToggleText active={!isSell} onClick={() => setSell(false)}>Buy</ToggleText><ToggleText active={isSell} onClick={() => setSell(true)}>Sell</ToggleText></h2>
                    </div>
                    <div>
                        <h2><ToggleText active={!isCrossChain} onClick={() => setCrossChain(false)}>Same-Chain</ToggleText><ToggleText active={isCrossChain} onClick={() => setCrossChain(true)}>Cross-Chain</ToggleText></h2>
                    </div>
                </Title>

                {/* SAME CHAIN */}
                {!isSell && !isCrossChain && (
                    <Steps>
                        <Step>
                            <div>
                                1. Browse and search orders
                            </div>
                        </Step>
                        <Arrow />
                        <Step>
                            <div>
                                2. Check for available assets to trade
                            </div>
                        </Step>
                        <Arrow />
                        <Step>
                            <div>
                                3. Perform asset swaps
                            </div>
                        </Step>
                    </Steps>
                )
                }
                {isSell && !isCrossChain && (
                    <Steps>
                        <Step>
                            <div>
                                1. Specify assets wish to trade and deposit NFT into escrow contract
                            </div>
                        </Step>
                        <Arrow />
                        <Step>
                            <div>
                                2. Received the asset when someone executed a swap
                            </div>
                        </Step>
                    </Steps>
                )}
                {/* CROSS CHAIN */}

                {!isSell && isCrossChain && (
                    <Steps>
                        <Step>
                            <div>
                                1. Browse and search orders
                            </div>
                        </Step>
                        <Arrow />
                        <Step>
                            <div>
                                2. Check for available assets to trade and its chains
                            </div>
                        </Step>
                        <Arrow />
                        <Step>
                            <div>
                                3. Deposit the asset into escrow contract
                            </div>
                        </Step>
                        <Arrow />
                        <Step>
                            <div>
                                4. Claim the NFT at the seller's chain
                            </div>
                        </Step>
                    </Steps>
                )}

                {isSell && isCrossChain && (
                    <Steps>
                        <Step>
                            <div>
                                1. Specify assets and its chains wish to trade & deposit NFT into escrow contract
                            </div>
                        </Step>
                        <Arrow />
                        <Step>
                            <div>
                                2. Waiting for the buyer to completed a cross-chain transaction
                            </div>
                        </Step>
                        <Arrow />
                        <Step>
                            <div>
                                3. Claim the NFT or tokens at the buyer chain
                            </div>
                        </Step>
                    </Steps>
                )}



            </InnerContainer>
        </Container>
    )
}

export default HowItWorks