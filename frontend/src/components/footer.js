import React from "react";
import styled from "styled-components";

const TextLink = styled.a`
  color: inherit;
  font-size: 18px;

  :hover {
    cursor: pointer;
    color: white;
  }
`;

const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 6rem;
  padding-bottom: 1rem;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  div {
    :last-child {
      margin-left: auto;
    }
  }
`;

const Footer = () => {
  return (
    <Container style={{ fontFamily: "VT323", fontSize: "20px" }}>
      <div>Copyright © 2022 Tamago Finance</div>
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        Made with love during SCB10x Metathon'22
      </div>
      <div>
        <TextLink
          href="https://github.com/tamago-finance/marketplace-scb10x"
          target="_blank"
        >
          GitHub
        </TextLink>
        <TextLink
          href="https://docs.tamago.finance/tamago-finance/multi-chain-marketplace"
          target="_blank"
          style={{ marginLeft: "10px" }}
        >
          Docs
        </TextLink>
      </div>
    </Container>
  );
};

export default Footer;
