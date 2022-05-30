const axios = require('axios')

const getMetadata = async (nft) => {
  let metadata = JSON.parse(nft.metadata)

  // fetch from token uri
  if (!metadata && nft && nft.token_uri) {
    console.log("no metadata!")

    const uri = nft.token_uri.replaceAll("000000000000000000000000000000000000000000000000000000000000000", "")
    // proxy 
    const { data } = await axios.get(`https://slijsy3prf.execute-api.ap-southeast-1.amazonaws.com/stage/proxy/${uri}`)

    if (data && data.data) {
      metadata = data.data
    }
  }

  return {
    ...nft,
    metadata,
  }
}

module.exports = {
  getMetadata
}