
const { db } = require("../../firebase")
const { Moralis, MoralisOptions } = require("../../moralis")
const { convertDecimalToHexadecimal, wait } = require("../../utils")

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
    } else {
      owners = []
    }
  } catch (e) {
    console.log(e)
  }

  return owners.length || NaN
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
    return NaN
  }
}

const getFloorPrice = async (chain, address, days) => {
  //TODO to be editted
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