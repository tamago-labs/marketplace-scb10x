const { db } = require("../firebase")
const { Moralis, MoralisOptions } = require("../moralis")
const { getMetadata } = require("../utils")
const validator = require('validator')

exports.getMetadata = async (req, res, next) => {
  try {

    if (!req || !req.params) {
      return res.status(400).json({ message: "missing query params" })
    }
    console.log(req.params)
    const { address, id, chain } = req.params

    if (!address || !id || !chain) {
      return res.status(400).json({ message: "some or all required fields are missing" })
    }

    if (!validator.isEthereumAddress(address)) {
      return res.status(400).json({ message: "invalid address " })
    }

    if (!chain.match(/^0x[0-9a-f]+$/i)) {
      return res.status(400).json({ message: "invalid chain. hexadecimal chainId required. (eg. '0x89')" })
    }

    const nft = await db.collection('nfts').where('address', '==', address).where('id', '==', id).where('chain', '==', chain).get()

    if (nft.empty) {
      // console.log("fetching metadata from Moralis...")
      await Moralis.start({ ...MoralisOptions })

      const options = {
        address: address,
        token_id: id,
        chain: chain,
      };
      let tokenIdMetadata
      try {
        tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options);
        console.log({ tokenIdMetadata })
        if (!tokenIdMetadata.metadata) {
          return res.status(424).json({ message: "Moralis API returns no metadata" })
        }
        const result = await getMetadata(tokenIdMetadata)
        const metadata = result.metadata
        // console.log("saving nft to firestore database...")
        await db.collection('nfts').add({ address, id, chain, metadata })
        return res.status(200).json({ status: "ok", metadata })
      } catch (error) {
        console.log(error.message)
        return res.status(424).json({ message: "Moralis API could not find metadata" })
      }


    } else {
      // console.log("fetching metadata from firestore database...")
      let result = []
      nft.forEach(doc => {
        result.push(doc.data())
      });
      return res.status(200).json({ status: "ok", metadata: result[0].metadata })
    }
  } catch (error) {
    next(error)
  }
}