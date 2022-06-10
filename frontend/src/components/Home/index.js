import React from "react";
import Jumbotron from "../jumbotron";
import Lists from "../lists";
import RankBoard from "../rankBoard";
import MintToken from "./mintToken";

const Home = () => {
  return (
    <>
      <Jumbotron />
      {/* <RankBoard /> */}
      <Lists />
      <div style={{ padding: "20px" }}>
        <MintToken />
      </div>
    </>
  );
};

export default Home;
