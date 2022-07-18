import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button } from "./buttons";

import ParticleBackground from 'react-particle-backgrounds'


const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 1rem;
`;

const RoundedBox = styled.div.attrs(() => ({}))`
  /* Created with https://www.css-gradient.com */
  background: #7602C1;
  background: -webkit-linear-gradient(top left, #7602C1, #DE96FF);
  background: -moz-linear-gradient(top left, #7602C1, #DE96FF);
  background: linear-gradient(to bottom right, #7602C1, #DE96FF);
  padding: 2rem 3rem; 
  margin-left: auto;
  margin-right: auto;
  color: white;
  font-weight: 600;
  border-radius: 12px;
  text-shadow: 1px 1px #333; 
  position: relative;
  overflow: hidden;
  min-height: 225px;

  @media only screen and (max-width: 1000px) {
    padding: 1rem 2rem; 
  }
`

const WelcomeText = styled.div`
  font-size: 26px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  @media only screen and (max-width: 1000px) {
    font-size: 22px;
  }

  @media only screen and (max-width: 700px) {
    font-size: 16px;
  }

  @media only screen and (max-width: 500px) {
    font-size: 14px;
  }
`;

const Buttons = styled.div`
  margin-top: 1rem; 
  text-align: center;
  z-index: 10;
  position: absolute;
  width: 100%;
  left: 0px;
`;

const TextLink = styled.a`
  color: inherit;
  font-size: 14px;
  text-decoration: none;

  :hover {
    cursor: pointer;
    color: white;
  }
`;

const Subtitle = styled.p`
text-align: center;
font-size: 14px;
margin-top: 1rem;

@media only screen and (max-width: 800px) {
  font-size: 12px;
 
}

@media only screen and (max-width: 500px) {
  margin-top: 0.2rem;
  font-size: 11px;
 
}
`

const DesktopHidden = styled.div`
  font-size: 14px;
  display: none;
  a {
    color: inherit;
  }
  @media only screen and (max-width: 1000px) {
    display: block;
    
  }

  @media only screen and (max-width: 600px) { 
    font-size: 12px;
  }

`

const Jumbotron = () => {

  const settings = {
    particle: {
      particleCount: 35,
      color: "#fff",
      minSize: 1,
      maxSize: 4
    },
    velocity: {
      minSpeed: 0.2,
      maxSpeed: 0.4
    },
    opacity: {
      minOpacity: 0,
      maxOpacity: 0.6,
      opacityTransitionTime: 10000
    }
  }

  return (
    <Container>

      <RoundedBox>
        <ParticleBackground style={{ position: "absolute", zIndex: 1 }} settings={settings} />
        <WelcomeText>
          Tamago Multi-chain NFT Marketplace allows anyone
          list NFT once and sell to any chain
        </WelcomeText>
        <Buttons>
          {/* <Link to="/createOrder">
            <Button
              style={{ color: "#7A0BC0", marginBottom: "10px", fontSize: "16px" }}
            >
              Create Order
            </Button>
          </Link> */}
          {/* <br />
          <TextLink
            href="https://github.com/tamago-finance/marketplace-scb10x"
            target="_blank"
          >
            GitHub
          </TextLink>
          <TextLink
            href="https://docs.tamago.finance/tamago-finance/multi-chain-marketplace"
            target="_blank"
            style={{ marginLeft: "40px" }}
          >
            Docs
          </TextLink> */}

          {/* <Button className="btn-secondary">
          Github
        </Button>
        <Button className="btn-secondary">
          Docs
        </Button> */}
          <div style={{ maxWidth: "800px", marginLeft: "auto", marginRight: "auto" }}>
            <Subtitle>🎉 The product was awarded the 1st prize from <a href="http://metathon.scb10x.com/" style={{ color: "inherit" }} target="_blank">SCB10X's Metaverse Global Hackathon'22</a> in the Infrastructure category and under heavy development </Subtitle>
          </div>
          <DesktopHidden>
            <Link to="/faucet">
              Testnet Faucet
            </Link>
            {` `}|{` `}
            <Link to="/createOrder">
              Sell
            </Link>
            {/* <Link to="/createCollection">
              Create Collection
            </Link> */}
            {` `}|{` `}
            <a target="_blank" href="https://docs.tamago.finance/tamago-finance/multi-chain-marketplace">
              Docs
            </a>
          </DesktopHidden>
        </Buttons>


      </RoundedBox>
    </Container>
  );
};

export default Jumbotron;
