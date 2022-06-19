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

    if (tokenId === undefined) {
      tokenId = "";
    }

    if (chain==="Ethereum") {
      return `https://opensea.io/assets/ethereum/${address}/${tokenId}`;
    } else {
      return `https://opensea.io/assets/matic/${address}/${tokenId}`;
    }
  };

  return { getOpenSeaTestnetLink, getOpenSeaLink };
};
export default useOpenSea;
