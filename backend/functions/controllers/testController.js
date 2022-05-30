const { db } = require("../firebase")
const { ethers } = require("ethers")

exports.getTestJSON = async (req, res, next) => {
  try {
    res.status(200).json({ message: "TESTGETJSON" })
  } catch (error) {
    next(error)
  }
}

exports.createMockData = async (req, res, next) => {
  try {
    const docRef = db.collection('users').doc('alovelace');

    await docRef.set({
      first: 'Ada',
      last: 'Lovelace',
      born: 1815
    });
    res.status(201).json({ message: "new collection added to database" })
  } catch (error) {
    next(error)
  }
}

exports.testEthers = async (req, res, next) => {
  try {
    const provider = new ethers.providers.getDefaultProvider();
    const blocknumber = await provider.getBlockNumber()
    console.log(blocknumber)
    res.status(200).json({ status: "ok", blocknumber })
  } catch (error) {
    next(error)
  }


}

exports.testMoralisNFTMetadata = async (req, res, next) => {
  try {
    const { Moralis, MoralisOptions } = require("../moralis")
    const { getMetadata } = require("../utils")
    await Moralis.start({ ...MoralisOptions })

    const options = {
      address: "0x9ebe531ebae026a391d0f51cd8db34c92ab07052",
      token_id: "5784",
      chain: "0x89",
    };

    const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options);
    const result = await getMetadata(tokenIdMetadata)
    res.status(200).json({ status: "ok", metadata: result.metadata })

  } catch (error) {
    next(error)
  }
}