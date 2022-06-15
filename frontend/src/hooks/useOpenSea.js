import React from "react";

window.Buffer = window.Buffer || require("buffer").Buffer;

const useOpenSea = () => {
  const getOpenSeaLink = (chain, address) => {
    const url = `https://opensea.io/assets/${chain}/${address}`;
    return url;
  };

  return { getOpenSeaLink };
};
export default useOpenSea;
