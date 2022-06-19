import React from "react";
import Jumbotron from "../jumbotron";
import Lists from "../lists";
import RankBoard from "../rankBoard";
import HowItWorks from "./howItWorks";
import Faq from "./faq"

const Home = () => {
  return (
    <>
      <Jumbotron />
      <RankBoard />

      <Lists />
      <HowItWorks />
      <Faq/>
    </>
  );
};

export default Home;
