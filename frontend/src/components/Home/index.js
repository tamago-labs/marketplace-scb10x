import React, { useState } from "react";
import Jumbotron from "../jumbotron";
import Lists from "../lists";
import RankBoard from "../rankBoard";
import HowItWorks from "./howItWorks";
import Faq from "./faq"
import { MAINNET_CHAINS, TESTNET_CHAINS } from "../../constants";
import styled from "styled-components";

const Switcher = styled.div`
  text-align: center;
  margin-top: 2rem; 
`

const Button = styled.button`
  background: transparent;
  padding: 5px 30px;
  color: white;
  border: 1px solid white;
  :first-child {
    border-right: 0px;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
  :last-child {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  ${props => props.active && `
  background: white;
  color: #333;
  
  `}
  
  
`

const Home = () => {

  const [isMainnet, setMainnet] = useState(false)

  return (
    <>
      <Jumbotron />



      <RankBoard />

      <Switcher>
        <Button active={isMainnet} onClick={() => setMainnet(true)}>
          Mainnet
        </Button>
        <Button active={!isMainnet} onClick={() => setMainnet(false)}>
          Testnet
        </Button>
      </Switcher>

      <Lists
        isMainnet={isMainnet}
      />
      <HowItWorks />
      <Faq />
    </>
  );
};

export default Home;
