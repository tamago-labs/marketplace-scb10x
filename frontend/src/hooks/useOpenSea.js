import React from "react";

window.Buffer = window.Buffer || require("buffer").Buffer;

const useOpenSea = () => {
  const getOpenSeaLink = (chain, address, tokenId) => {
    const chainName = chain.toLowerCase();
    const url = `https://testnets.opensea.io/assets/${address}/${tokenId}`;
    return url;
  };

  return { getOpenSeaLink };
};
export default useOpenSea;
