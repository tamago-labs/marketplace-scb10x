import React, { useState } from "react";
import styled from "styled-components";


const Container = styled.div.attrs(() => ({ className: "container" }))`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
`

const Title = styled.div`
    font-weight: 600;
    font-size: 32px;
    color: #fff;
    margin-bottom: 2rem;
    text-align: center;

    @media only screen and (max-width: 600px) {
          font-weight: 600;
          font-size: 18px;
    }

`


const FAQs = styled.div`
    max-width: 900px;
    margin-left: auto;
    margin-right: auto; 
    width: 100%;
`

const Question = styled.div`
    text-align: left; 
    h4 {
        font-size: 18px;
        font-weight: 600;
    }
`

const Faq = () => {

    return (
        <Container>
            <Title>
                ❔FAQ
            </Title>
            <FAQs>
                <Question>
                    <h4>1. What networks are supported?</h4>
                    <ul>
                        <li>Ethereum</li>
                        <li>Polygon</li>
                        <li>BNB Smart Chain</li>
                        <li>Avalanche</li>
                    </ul>
                    <p>*Testnet networks are also included for list above.</p>
                </Question>
                <Question>
                    <h4>2. What NFTs are supported?</h4>
                    <p>Any NFTs that exist on supported networks that use ERC-721, ERC-1155 standards. ERC-20 tokens can be accepted as payment.</p>
                </Question>
                <Question>
                    <h4>3. How much does it cost to use the platform?</h4>
                    <p>We do not charge any fees on NFT-to-NFT trading while tokens-to-NFT we could charge up to 1% fee on all transactions in the near future.  </p>
                </Question>
                <Question>
                    <h4>4. Is there a premium service available?</h4>
                    <p>Yes, we shall distribute the NFT pass via daily auction soon, the holders will access to exclusive benefits that will be announced later. </p>
                </Question>
            </FAQs>
        </Container>
    )
}

export default Faq