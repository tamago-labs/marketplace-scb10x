import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import AssetCard from "../OrderDetails/assetCard";
import NFTCard from "../nftCard";

/** Styled Component */
const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 2rem;
`;

/** Component */
const collection = () => {
  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "1rem",
          justifyContent: "center",
        }}
      >
        <NFTCard key={1} delay={1} order={58} />
      </div>
    </Container>
  );
};

export default collection;
