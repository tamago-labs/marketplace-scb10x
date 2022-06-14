const axios = require('axios')
const { db } = require('../firebase')
const { MARKETPLACES } = require('../constants')
const { ethers } = require('ethers')
const { MARKETPLACE_ABI } = require('../abi')


const getMetadata = async (nft) => {
  let metadata = JSON.parse(nft.metadata)

  // fetch from token uri
  if (!metadata && nft && nft.token_uri) {
    console.log("no metadata!")

    const uri = nft.token_uri.replaceAll("000000000000000000000000000000000000000000000000000000000000000", "")

    if (uri.indexOf("https://") === -1) {
      uri = `https://${uri}`
    }

    try {
      // proxy
      const { data } = await axios.get(`https://slijsy3prf.execute-api.ap-southeast-1.amazonaws.com/stage/proxy/${uri}`)

      if (data && data.data) {
        metadata = data.data
      }
    } catch (e) {

    }

  }

  return {
    ...nft,
    metadata,
  }
}

const generateRelayMessages = async () => {
  let orders = await db.collection("orders").where('version', '==', 1).where('confirmed', '==', true).where('visible', '==', true).get();
  const result = orders.docs.map((doc) => ({
    ...doc.data(),
  }));
  // console.log(result)
  const messages = result.reduce((output, item) => {

    const { barterList, chainId, orderId } = item

    if (barterList && chainId && barterList.length > 0) {
      for (let item of barterList) {
        // filter non-cross-chain items
        if (item.chainId !== chainId) {
          output.push({
            orderId,
            chainId: item.chainId,
            assetAddress: item.assetAddress,
            assetTokenIdOrAmount: item.assetTokenIdOrAmount
          })
        }
      }
    }
    return output
  }, [])
  return messages
}

const getProviders = (chainIds = []) => {
  return chainIds.map(chainId => {

    let url

    if (chainId === 42) {
      url = "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    } else if (chainId === 80001) {
      url = "https://nd-546-345-588.p2pify.com/8947d77065859cda88213b612a0f8679"
    } else if (chainId === 97) {
      url = "https://nd-390-191-961.p2pify.com/0645132aa2a233d3fbe27116f3b8828b"
    } else if (chainId === 43113) {
      url = "https://nd-473-270-876.p2pify.com/613a7805f3d64a52349b6ca19b6e27a7/ext/bc/C/rpc"
    }

    if (!url) {
      return
    }

    const provider = new ethers.providers.JsonRpcProvider(url)

    return {
      chainId,
      provider
    }
  })
}

const generateValidatorMessages = async () => {

  let orders = await db.collection("orders").where('version', '==', 1).where('confirmed', '==', true).where('visible', '==', true).get();
  orders = orders.docs.map((doc) => ({
    ...doc.data(),
  }));

  const relayMessages = await generateRelayMessages()

  let claims = []
  let checks = []

  const providers = getProviders([42, 80001, 97, 43113])

  // find the claim result
  for (let message of relayMessages) {

    const { ownerAddress, chainId, orderId } = orders.find(item => item.orderId === message.orderId)

    // to prevent unnecessary checks
    const check = checks.find(item => item.orderId === orderId && item.chainId === message.chainId)

    if (!check) {
      checks.push({
        chainId: message.chainId,
        orderId
      })

      const row = providers.find(item => item.chainId === message.chainId)

      if (row && row.provider) {

        const { provider } = row
        // console.log({ MARKETPLACES })
        const { contractAddress } = MARKETPLACES.find(item => item.chainId === message.chainId)

        const marketplaceContract = new ethers.Contract(contractAddress, MARKETPLACE_ABI, provider)

        const result = await marketplaceContract.partialOrders(orderId)

        if (result['active']) {
          // Buyer
          claims.push({
            orderId: message.orderId,
            chainId,
            claimerAddress: result['buyer'],
            isOrigin: true
          })

          // Seller
          claims.push({
            orderId: message.orderId,
            chainId: message.chainId,
            claimerAddress: ownerAddress,
            isOrigin: false
          })
        }
      }
    }

  }

  // remove duplicates
  claims = claims.reduce((output, item) => {
    const existing = output.find(x => x.hash === (ethers.utils.hashMessage(JSON.stringify(item))))
    if (!existing) {
      output.push({
        ...item,
        hash: ethers.utils.hashMessage(JSON.stringify(item))
      })
    }
    return output
  }, [])

  console.log("Total claims : ", claims.length)

  return claims
}

const getOwnerName = async (ownerAddress) => {
  const { data } = await axios.get(
    `https://api.tamago.finance/v2/account/${ownerAddress}`
  );
  if (data.status != "ok") {
    return "Unknown";
  }

  return data.nickname || "Unknown"

}




module.exports = {
  getMetadata,
  generateRelayMessages,
  generateValidatorMessages,
  getOwnerName
}