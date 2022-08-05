
const axios = require("axios")
const { ethers } = require("ethers")

const { db } = require("../../firebase")
const { Moralis, MoralisOptions } = require("../../moralis")
const { convertDecimalToHexadecimal, wait } = require("../../utils")
const { COIN_GECKO_API_BASE } = require("../../constants")
const { getAllActiveOrders } = require("./orders")

const getCollectionByChainAndAddress = async (chainId, address) => {
  try {
    const result = await db.collection("collections-v2").doc(`${chainId}.${address}`).get()
    if (result.empty) {
      return null
    }
    const collection = result.data()
    return collection
  } catch (error) {
    console.log(error)
  }
}

const getCollectionsByChain = async (chainId) => {
  const result = await db.collection("collections-v2").where("chainId", "==", Number(chainId)).get()
  if (result.empty) {

    return []
  } else {
    return result.docs.map(doc => doc.data())
  }
}

const getTotalOwners = async (chain, address) => {

  await Moralis.start(MoralisOptions)

  let owners = []
  let length = NaN

  try {

    const options = {
      address,
      chain: convertDecimalToHexadecimal(chain)
    }

    if (address !== "0x2953399124f0cbb46d2cbacd8a89cf0599974963" && address !== "0x495f947276749ce646f68ac8c248420045cb7b5e") {
      let result = await Moralis.Web3API.token.getNFTOwners(options);
      owners = result.result.map(item => item['owner_of'])
      await wait()
      while (result.next) {
        result = await result.next()
        const o = result.result.map(item => item['owner_of'])
        owners = owners.concat(o)
        await wait()

      }
      console.log(owners)
      owners = Array.from(new Set(owners));
      length = owners.length

    } else {
      length = 560_000
    }
  } catch (e) {
    console.log(e)
  }

  return length
}



const getTotalSupply = async (chain, address) => {
  await Moralis.start(MoralisOptions)
  const options = {
    address,
    chain: convertDecimalToHexadecimal(chain)
  }
  if (address !== "0x2953399124f0cbb46d2cbacd8a89cf0599974963" && address !== "0x495f947276749ce646f68ac8c248420045cb7b5e") {
    const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    return NFTs.total
  } else {
    return 1_700_000
  }
}

const getFloorPrice = async (chain, address) => {

  if (address !== "0x2953399124f0cbb46d2cbacd8a89cf0599974963" && address !== "0x495f947276749ce646f68ac8c248420045cb7b5e") {
    const priceData = await axios.get(
      `${COIN_GECKO_API_BASE}/simple/price?ids=wmatic,weth,dai,busd,wbnb,tether,usd-coin,crypto-com-chain&vs_currencies=usd`
    );

    // fetching orders from cache and filtering out orders from other collections
    const orders = (await getAllActiveOrders())
    // console.log(orders)

    const filteredOrders = orders.filter(order => {
      return Number(order.chainId) === Number(chain) && order.baseAssetAddress === address
    }
    )

    const lowestPrice = filteredOrders.reduce((lowest, currentOrder) => {
      const { barterList } = currentOrder
      //filtering out non-ERC20
      const ERC20BarterList = barterList.filter(token => token.tokenType === 0)
      //getting lowest price for each active order
      const lowestFromOrder = ERC20BarterList.reduce((lowest, current) => {
        const tokenPrice = ethers.utils.formatUnits(
          current.assetTokenIdOrAmount,
          current.decimals);

        let tokenUsdPrice;

        switch (current.symbol.toLowerCase()) {
          case "wmatic":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data.wmatic.usd;
            break;
          case "usdc":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data['usd-coin'].usd;
            break;
          case "usdc.e":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data['usd-coin'].usd;
            break;
          case "usdt":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data.tether.usd;
            break;
          case "usdt.e":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data.tether.usd;
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
          case "cro":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data['crypto-com-chain'].usd;
            break;
          case "wcro":
            tokenUsdPrice = parseFloat(tokenPrice) * priceData.data['crypto-com-chain'].usd;
            break;
          default:
            tokenUsdPrice = parseFloat(tokenPrice);
            break;
        }

        return tokenUsdPrice < lowest ? tokenUsdPrice : lowest

      }, Infinity)

      return lowestFromOrder < lowest ? lowestFromOrder : lowest
    }, Infinity)
    return lowestPrice !== Infinity ? lowestPrice : NaN
  } else {
    return 0
  }
}
const addCollectionToDb = async (chain, address) => {
  // try {
  //   await Moralis.start(MoralisOptions)
  //   const options = {
  //     address,
  //     chain: convertDecimalToHexadecimal(chain)
  //   }
  //   const metaData = await Moralis.Web3API.token.getNFTMetadata(options)
  //   console.log(metaData)
  //   const newData = {
  //     "links": {
  //       "twitterLink": "",
  //       "chainExplorerLink": "",
  //       "website": ""
  //     },
  //     "description": "",
  //     "totalSupply": await getTotalSupply(chain, address),
  //     "chainId": Number(chain),
  //     "cover": "",
  //     "assetAddress": address,
  //     "isBanned": false,
  //     "slug": "",
  //     "isVerified": false,
  //     "title": metaData.name,
  //     "totalOwners": 0,
  //     "lastSyncTimestamp": 0,
  //   }
  //   await db.collection("collections-v2").doc(`${chain}.${address}`).set(newData)
  //   return { status: "ok", metaData: newData }
  // } catch (error) {
  //   return { status: "error" }
  // }
}
module.exports = {
  getCollectionByChainAndAddress,
  getCollectionsByChain,
  getTotalOwners,
  getTotalSupply,
  getFloorPrice,
  // addCollectionToDb
}