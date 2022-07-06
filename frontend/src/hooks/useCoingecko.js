import { useCallback } from "react";
import axios from "axios";
import { COIN_GECKO_API_BASE } from "../constants";
import { ethers } from "ethers";

const useCoingecko = () => {
  const getLowestPrice = useCallback(async (orders) => {
    let usdPrice = [];

    //get price data from CoinGecko
    const priceData = await axios.get(
      `${COIN_GECKO_API_BASE}/simple/price?ids=wmatic,weth,dai,busd,wbnb&vs_currencies=usd`
    );

    //change token price to usd and keep it in array
    orders.map((order) => {
      const token = order.barterList.find((item) => item.tokenType === 0);
      if (token) {
        let tokenUsdPrice;
        let tokenPrice = ethers.utils.formatUnits(
          token.assetTokenIdOrAmount,
          token.decimals
        );
        switch (token.symbol.toLowerCase()) {
          case "wmatic":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data.wmatic.usd;
            break;

          case "weth":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data.weth.usd;
            break;

          case "dai":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data.dai.usd;
            break;

          case "busd":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data.busd.usd;
            break;

          case "wbnb":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data.wbnb.usd;
            break;

          default:
            tokenUsdPrice = parseFloat(tokenPrice);
            break;
        }

        usdPrice.push(tokenUsdPrice);
      }
    });

    //sort
    usdPrice.sort((a, b) => a - b);

    return usdPrice[0];
  }, []);

  return { getLowestPrice };
};

export default useCoingecko;
