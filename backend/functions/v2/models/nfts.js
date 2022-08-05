const { db } = require("../../firebase")
const { Moralis, MoralisOptions } = require("../../moralis")
const { convertDecimalToHexadecimal, getMetadata } = require("../../utils")

const reSyncMetaData = async (chain, address, tokenId,) => {
  try {
    await Moralis.start(MoralisOptions)
    const options = {
      chain: convertDecimalToHexadecimal(Number(chain)),
      token_id: tokenId,
      address,
      flag: "uri",
    }
    await Moralis.Web3API.token.reSyncMetadata(options)
    return
  } catch (error) {
    console.log(error)
  }
}

const getNFTMetadata = async (chain, address, tokenId,) => {
  try {
    await Moralis.start(MoralisOptions)
    const options = {
      chain: convertDecimalToHexadecimal(chain),
      token_id: tokenId,
      address,
    }
    const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options);
    return tokenIdMetadata
  } catch (error) {
    console.log(error)
  }
}

const refreshNFTMetadata = async (chain, address, tokenId,) => {
  try {
    const queryResult = await db.collection("nfts").where("chain", "==", convertDecimalToHexadecimal(Number(chain)).toLowerCase()).where("address", "==", address).where("id", "==", tokenId).get()
    await Moralis.start(MoralisOptions)
    const options = {
      chain: convertDecimalToHexadecimal(Number(chain)),
      token_id: tokenId,
      address,
    }
    const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options)
    const result = await getMetadata(tokenIdMetadata)
    const metadata = result.metadata

    if (queryResult.empty) {
      await db.collection('nfts').add({ address, id: tokenId, chain: convertDecimalToHexadecimal(Number(chain)).toLowerCase(), metadata })
    } else {
      queryResult.docs.map(doc => { doc.ref.update({ metadata }) })
    }
    return metadata
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  reSyncMetaData,
  getNFTMetadata,
  refreshNFTMetadata
}