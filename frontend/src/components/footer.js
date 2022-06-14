import React from "react";
import styled from "styled-components";

const TextLink = styled.a`
  color: inherit;
  font-size: 14px;

  :hover {
    cursor: pointer;
    color: white;
  }

  :not(:first-child) {
    margin-left: 10px;
  }

`;

const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 5rem;
  padding-bottom: 1rem;
  font-size: 14px; 
  div {
    div {
      text-align :center;
    }
  }
`;

const Footer = () => {
  return (
    <Container>
      {/* <div>Copyright © 2022 Tamago Finance</div>
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        Made with love during SCB10x Metathon'22
      </div>
      <div>
        <TextLink
          href="https://twitter.com/TamagoFinance"
          target="_blank"
        >
          Twitter
        </TextLink>
        <TextLink
          href="https://t.me/tamagofinance"
          target="_blank"
        >
          Telegram
        </TextLink>
        <TextLink
          href="https://discord.gg/78fax5dPqk"
          target="_blank"
        >
          Discord
        </TextLink>
        <TextLink
          href="https://github.com/tamago-finance/marketplace-scb10x"
          target="_blank"
        >
          GitHub
        </TextLink>
        <TextLink
          href="https://docs.tamago.finance/tamago-finance/multi-chain-marketplace"
          target="_blank"
        >
          Docs
        </TextLink>
      </div> */}
      <div className="row">
        <div className="col-6 col-sm-4" style={{marginTop: "10px"}}>
          Copyright © 2022 Tamago Finance
        </div>
        <div className="col-6 col-sm-4" style={{marginTop: "10px"}}>
          Made with love during SCB10x Metathon'22
        </div>
        <div className="col-12 col-sm-4" style={{marginTop: "10px"}}>
          <TextLink
            href="https://twitter.com/TamagoFinance"
            target="_blank"
          >
            Twitter
          </TextLink>
          <TextLink
            href="https://t.me/tamagofinance"
            target="_blank"
          >
            Telegram
          </TextLink>
          <TextLink
            href="https://discord.gg/78fax5dPqk"
            target="_blank"
          >
            Discord
          </TextLink>
          <TextLink
            href="https://github.com/tamago-finance/marketplace-scb10x"
            target="_blank"
          >
            GitHub
          </TextLink>
          <TextLink
            href="https://docs.tamago.finance/tamago-finance/multi-chain-marketplace"
            target="_blank"
          >
            Docs
          </TextLink>
        </div>
      </div>

    </Container>
  );
};

export default Footer;
