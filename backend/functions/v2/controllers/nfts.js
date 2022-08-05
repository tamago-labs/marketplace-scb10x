const validator = require("validator")

const { SUPPORTED_CHAINS } = require('../../constants')
const { getCollectionByChainAndAddress } = require("../models/collections")
const { reSyncMetaData, refreshNFTMetadata } = require("../models/nfts")

exports.refreshMetadata = async (req, res, next) => {
  try {
    const { chain, contractAddress, tokenId } = req.params
    if (!chain || !contractAddress || !tokenId) {
      return res.status(400).json({ message: "Some required input(s) missing." })
    }
    if (!SUPPORTED_CHAINS.includes(Number(chain))) {
      return res.status(400).json({ message: "This chain is not supported" })
    }
    if (!validator.isEthereumAddress(contractAddress)) {
      return res.status(400).json({ message: "Contract address is invalid" })
    }
    // const collection = await getCollectionByChainAndAddress(chain, contractAddress)
    // if (!collection) {
    //   return res.status(400).json({ message: "This collection is not in our database" })
    // }

    await reSyncMetaData(chain, contractAddress, tokenId)

    const metadata = await refreshNFTMetadata(chain, contractAddress, tokenId)

    return res.json({ status: "ok", metadata: metadata })

  } catch (error) {
    next(error)
  }
}