import React from "react";

window.Buffer = window.Buffer || require("buffer").Buffer;

const useOpenSea = () => {
  const getOpenSeaTestnetLink = (chain, address, tokenId) => {
    const chainName = chain.toLowerCase();
    if (tokenId === undefined) {
      tokenId = "";
    }
    const url = `https://testnets.opensea.io/assets/${chainName}/${address}/${tokenId}`;
    return url;
  };

  const getOpenSeaLink = (chain, address, tokenId) => {
    const chainName = chain.toLowerCase();

    if (chain !== "Polygon") {
      return ""
    }

    if (tokenId === undefined) {
      tokenId = "";
    }
    // Opensea supports only Matic
    const url = `https://opensea.io/assets/matic/${address}/${tokenId}`;
    return url;
  };

  return { getOpenSeaTestnetLink, getOpenSeaLink };
};
export default useOpenSea;
