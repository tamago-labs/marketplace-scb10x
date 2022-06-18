import React from "react";
import Jumbotron from "../jumbotron";
import Lists from "../lists";
import RankBoard from "../rankBoard"; 
import HowItWorks from "./howItWorks";

const Home = () => {
  return (
    <>
      <Jumbotron />
      <RankBoard />
      
      <Lists />
       <HowItWorks/>
    </>
  );
};

export default Home;
