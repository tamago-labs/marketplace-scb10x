const axios = require('axios')
const { db } = require('../firebase')
const { MARKETPLACES } = require('../constants')
const { ethers } = require('ethers')
const { MARKETPLACE_ABI } = require('../abi')
const { supportedChains } = require('../constants')
const { Moralis, generateMoralisParams } = require('../moralis')

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
  const messages = result.filter(item => ((!item.fulfilled) && (!item.canceled))).reduce((output, item) => {

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

const getProviders = () => {

  const chainIds = supportedChains

  return chainIds.map(chainId => {

    let url

    if (chainId === 42) {
      url = "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    } else if (chainId === 137) {
      url = "https://nd-643-057-168.p2pify.com/2ffe10d04df48d14f0e9ff6e0409f649"
    } else if (chainId === 80001) {
      url = "https://nd-546-345-588.p2pify.com/8947d77065859cda88213b612a0f8679"
    } else if (chainId === 97) {
      url = "https://nd-390-191-961.p2pify.com/0645132aa2a233d3fbe27116f3b8828b"
    } else if (chainId === 56) {
      url = "https://nd-886-059-484.p2pify.com/b62941033adcd0358ff9f38df217f856"
    } else if (chainId === 43113) {
      url = "https://nd-473-270-876.p2pify.com/613a7805f3d64a52349b6ca19b6e27a7/ext/bc/C/rpc"
    } else if (chainId === 43114) {
      url = "https://nd-752-163-197.p2pify.com/fd84ccbd64f32d8f8a99adb5d4557b0e/ext/bc/C/rpc"
    } else if (chainId === 1) {
      url = "https://nd-814-913-142.p2pify.com/cb3fe487ef9afa11bda3c38e54b868a3"
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

const resolveClaimTable = (chainId) => {
  switch (chainId) {
    case 97:
      return "bnbTestnetClaim"
    case 42:
      return "kovanTestnetClaim"
    case 80001:
      return "mumbaiTestnetClaim"
    case 43113:
      return "fujiTestnetClaim"
    case 56:
      return "bnbClaim"
    case 137:
      return "bnbClaim"
    case 43114:
      return "avaxClaim"
    case 1:
      return "ethClaim"
  }
}

const generateBuyerTickets = async ({
  providers,
  relayMessages,
  orders
}) => {
  let claims = []
  let checks = []

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
        const { contractAddress } = MARKETPLACES.find(item => Number(item.chainId) === Number(message.chainId))

        const marketplaceContract = new ethers.Contract(contractAddress, MARKETPLACE_ABI, provider)

        const result = await marketplaceContract.partialOrders(orderId)

        if (result['active']) {
          // Buyer
          claims.push({
            orderId: Number(message.orderId),
            chainId,
            claimerAddress: (result['buyer']).toLowerCase(),
            isOrigin: true
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

  return claims
}

const generateSellerTickets = async ({
  orders,
  providers
}) => {
  let claims = []

  for (let chainId of supportedChains) {

    await Moralis.start(generateMoralisParams(chainId));

    // checking claim events
    const Claims = Moralis.Object.extend(resolveClaimTable(chainId));
    const query = new Moralis.Query(Claims);
    query.limit(1000)
    query.equalTo("isOriginChain", true)

    const results = await query.find();

    // looking for unclaimed orders
    for (let object of results) {

      const orderId = object.get("orderId")
      const fromAddress = object.get("fromAddress")

      const originalItem = orders.find(item => Number(item.orderId) === Number(orderId))

      if (originalItem && originalItem.barterList.length > 0) {

        const list = originalItem.barterList.sort(function (a, b) {
          return b.chainId - a.chainId;
        });

        for (let pairItem of list) {

          const row = providers.find(item => Number(item.chainId) === Number(pairItem.chainId))

          if (row && row.provider) {

            const { provider } = row
            const { contractAddress } = MARKETPLACES.find(item => Number(item.chainId) === Number(pairItem.chainId))

            const marketplaceContract = new ethers.Contract(contractAddress, MARKETPLACE_ABI, provider)
            try {
              const result = await marketplaceContract.partialOrders(orderId)

              if (!result["ended"] && (result['buyer']).toLowerCase() === fromAddress.toLowerCase()) {
                // granting a ticket for the seller
                claims.push({
                  orderId: Number(orderId),
                  chainId: pairItem.chainId,
                  claimerAddress: (originalItem.ownerAddress).toLowerCase(),
                  isOrigin: false
                })
                break
              }

            } catch (e) {
              // console.log("no active orders on chain id : ", pairItem.chainId)
            }
          }
        }
      }
    }
  }

  return claims
}

const generateValidatorMessages = async () => {

  let orders = await db.collection("orders").where('version', '==', 1).where('confirmed', '==', true).where('visible', '==', true).get();
  orders = orders.docs.map((doc) => ({
    ...doc.data(),
  }));

  const relayMessages = await generateRelayMessages()

  const providers = getProviders()

  const buyerTickets = await generateBuyerTickets({
    providers,
    relayMessages,
    orders
  })

  const sellerTickers = await generateSellerTickets({
    providers,
    orders
  })

  const claims = buyerTickets.concat(sellerTickers)

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