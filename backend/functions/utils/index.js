require('dotenv').config();
const axios = require('axios');

const { db } = require('../firebase');
const { MARKETPLACES } = require('../constants');
const { ethers } = require('ethers');
const { MARKETPLACE_ABI } = require('../abi');
const {
  SUPPORTED_CHAINS,
  POLYGON_RPC_SERVERS,
  MAINNET_RPC_SERVERS,
  KOVAN_RPC_SERVERS,
  MUMBAI_RPC_SERVERS,
  BNB_RPC_SERVERS,
  FUJI_RPC_SERVERS,
  BNB_TESTNET_RPC_SERVERS,
  AVALANCHE_C_CHAIN_RPC_SERVERS,
  CRONOS_RPC_SERVERS,
} = require('../constants');
const { Moralis, generateMoralisParams } = require('../moralis');

const getMetadata = async (nft) => {
  let metadata = JSON.parse(nft.metadata);

  // fetch from token uri
  if (!metadata && nft && nft.token_uri) {
    console.log('no metadata!');

    const uri = nft.token_uri.replaceAll(
      '000000000000000000000000000000000000000000000000000000000000000',
      ''
    );

    if (uri.indexOf('https://') === -1) {
      uri = `https://${uri}`;
    }

    try {
      // proxy
      const { data } = await axios.get(
        `https://slijsy3prf.execute-api.ap-southeast-1.amazonaws.com/stage/proxy/${uri}`
      );

      if (data && data.data) {
        metadata = data.data;
      }
    } catch (e) {}
  }

  return {
    ...nft,
    metadata,
  };
};

const generateRelayMessages = async () => {
  let orders = await db
    .collection('orders')
    .where('version', '==', 1)
    .where('confirmed', '==', true)
    .where('visible', '==', true)
    .get();
  const result = orders.docs.map((doc) => ({
    ...doc.data(),
  }));
  // console.log(result)
  const messages = result
    .filter((item) => !item.fulfilled && !item.canceled)
    .reduce((output, item) => {
      const { barterList, chainId, orderId } = item;

      if (barterList && chainId && barterList.length > 0) {
        for (let item of barterList) {
          // filter non-cross-chain items
          if (item.chainId !== chainId) {
            output.push({
              orderId,
              chainId: item.chainId,
              assetAddress: item.assetAddress,
              assetTokenIdOrAmount: item.assetTokenIdOrAmount,
            });
          }
        }
      }
      return output;
    }, []);
  return messages;
};

const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getProviders = () => {
  const chainIds = SUPPORTED_CHAINS;

  return chainIds.map((chainId) => {
    let url;

    if (chainId === 42) {
      url = getRandomItem(KOVAN_RPC_SERVERS);
    } else if (chainId === 137) {
      url = getRandomItem(POLYGON_RPC_SERVERS);
    } else if (chainId === 80001) {
      url = getRandomItem(MUMBAI_RPC_SERVERS);
    } else if (chainId === 97) {
      url = getRandomItem(BNB_TESTNET_RPC_SERVERS);
    } else if (chainId === 56) {
      url = getRandomItem(BNB_RPC_SERVERS);
    } else if (chainId === 43113) {
      url = getRandomItem(FUJI_RPC_SERVERS);
    } else if (chainId === 43114) {
      url = getRandomItem(AVALANCHE_C_CHAIN_RPC_SERVERS);
    } else if (chainId === 1) {
      url = getRandomItem(MAINNET_RPC_SERVERS);
    } else if (chainId === 25) {
      url = getRandomItem(CRONOS_RPC_SERVERS);
    }

    if (!url) {
      return;
    }

    const provider = new ethers.providers.JsonRpcProvider(url);

    return {
      chainId,
      provider,
    };
  });
};

const resolveClaimTable = (chainId) => {
  switch (chainId) {
    case 97:
      return 'bnbTestnetClaim';
    case 42:
      return 'kovanTestnetClaim';
    case 80001:
      return 'mumbaiTestnetClaim';
    case 43113:
      return 'fujiTestnetClaim';
    case 56:
      return 'bnbClaim';
    case 137:
      return 'bnbClaim';
    case 43114:
      return 'avaxClaim';
    case 1:
      return 'ethClaim';
  }
};

const generateBuyerTickets = async ({ providers, relayMessages, orders }) => {
  let claims = [];
  let checks = [];

  // find the claim result
  for (let message of relayMessages) {
    const { ownerAddress, chainId, orderId } = orders.find(
      (item) => item.orderId === message.orderId
    );

    // to prevent unnecessary checks
    const check = checks.find(
      (item) => item.orderId === orderId && item.chainId === message.chainId
    );

    if (!check) {
      checks.push({
        chainId: message.chainId,
        orderId,
      });

      const row = providers.find((item) => item.chainId === message.chainId);

      if (row && row.provider) {
        const { provider } = row;
        const { contractAddress } = MARKETPLACES.find(
          (item) => Number(item.chainId) === Number(message.chainId)
        );

        const marketplaceContract = new ethers.Contract(
          contractAddress,
          MARKETPLACE_ABI,
          provider
        );

        const result = await marketplaceContract.partialOrders(orderId);

        if (result['active']) {
          // Buyer
          claims.push({
            orderId: Number(message.orderId),
            chainId,
            claimerAddress: result['buyer'].toLowerCase(),
            isOrigin: true,
          });
        }
      }
    }
  }

  // remove duplicates
  claims = claims.reduce((output, item) => {
    const existing = output.find(
      (x) => x.hash === ethers.utils.hashMessage(JSON.stringify(item))
    );
    if (!existing) {
      output.push({
        ...item,
        hash: ethers.utils.hashMessage(JSON.stringify(item)),
      });
    }
    return output;
  }, []);

  return claims;
};

const generateSellerTickets = async ({ orders, providers }) => {
  let claims = [];

  for (let chainId of SUPPORTED_CHAINS) {
    await Moralis.start(generateMoralisParams(chainId));

    // checking claim events
    const Claims = Moralis.Object.extend(resolveClaimTable(chainId));
    const query = new Moralis.Query(Claims);
    query.limit(1000);
    query.equalTo('isOriginChain', true);

    const results = await query.find();

    // looking for unclaimed orders
    for (let object of results) {
      const orderId = object.get('orderId');
      const fromAddress = object.get('fromAddress');

      const originalItem = orders.find(
        (item) => Number(item.orderId) === Number(orderId)
      );

      if (originalItem && originalItem.barterList.length > 0) {
        const list = originalItem.barterList.sort(function (a, b) {
          return b.chainId - a.chainId;
        });

        for (let pairItem of list) {
          const row = providers.find(
            (item) => Number(item.chainId) === Number(pairItem.chainId)
          );

          if (row && row.provider) {
            const { provider } = row;
            const { contractAddress } = MARKETPLACES.find(
              (item) => Number(item.chainId) === Number(pairItem.chainId)
            );

            const marketplaceContract = new ethers.Contract(
              contractAddress,
              MARKETPLACE_ABI,
              provider
            );
            try {
              const result = await marketplaceContract.partialOrders(orderId);

              if (
                !result['ended'] &&
                result['buyer'].toLowerCase() === fromAddress.toLowerCase()
              ) {
                // granting a ticket for the seller
                claims.push({
                  orderId: Number(orderId),
                  chainId: pairItem.chainId,
                  claimerAddress: originalItem.ownerAddress.toLowerCase(),
                  isOrigin: false,
                });
                break;
              }
            } catch (e) {
              // console.log("no active orders on chain id : ", pairItem.chainId)
            }
          }
        }
      }
    }
  }

  return claims;
};

const generateValidatorMessages = async () => {
  let orders = await db
    .collection('orders')
    .where('version', '==', 1)
    .where('confirmed', '==', true)
    .where('visible', '==', true)
    .get();
  orders = orders.docs.map((doc) => ({
    ...doc.data(),
  }));

  const relayMessages = await generateRelayMessages();

  const providers = getProviders();

  const buyerTickets = await generateBuyerTickets({
    providers,
    relayMessages,
    orders,
  });

  const sellerTickers = await generateSellerTickets({
    providers,
    orders,
  });

  const claims = buyerTickets.concat(sellerTickers);

  console.log('Total claims : ', claims.length);

  return claims;
};

const getOwnerName = async (ownerAddress) => {
  let account = await db
    .collection('accounts')
    .where('address', '==', String(ownerAddress))
    .get();
  if (account.empty) {
    const { data } = await axios.get(
      `https://api.tamago.finance/v2/account/${ownerAddress}`
    );
    if (data.status != 'ok') {
      return 'Unknown';
    }
    return data.nickname || 'Unknown';
  } else {
    account = account.docs.map((doc) => ({
      ...doc.data(),
    }))[0];
    return account.nickname || 'Unknown';
  }
};

const getRpcUrl = (chainId) => {
  let rpcUrl;
  switch (Number(chainId)) {
    case 1:
      rpcUrl = getRandomItem(MAINNET_RPC_SERVERS);
      break;
    case 25:
      rpcUrl = getRandomItem(CRONOS_RPC_SERVERS);
      break;
    case 42:
      rpcUrl = getRandomItem(KOVAN_RPC_SERVERS);
      break;
    case 56:
      rpcUrl = getRandomItem(BNB_RPC_SERVERS);
      break;
    case 97:
      rpcUrl = getRandomItem(BNB_TESTNET_RPC_SERVERS);
      break;
    case 137:
      rpcUrl = getRandomItem(POLYGON_RPC_SERVERS);
      break;
    case 43113:
      rpcUrl = getRandomItem(FUJI_RPC_SERVERS);
      break;
    case 43114:
      rpcUrl = getRandomItem(AVALANCHE_C_CHAIN_RPC_SERVERS);
      break;
    case 80001:
      rpcUrl = getRandomItem(MUMBAI_RPC_SERVERS);
      break;
    default:
      break;
  }
  return rpcUrl;
};

const recoverAddressFromMessageAndSignature = (message, signature) => {
  return ethers.utils.verifyMessage(message, signature);
};

const convertDecimalToHexadecimal = (number) => {
  if (typeof number !== 'number' && typeof number !== 'string') {
    throw new Error('invalid argument type.');
  }
  return '0x' + number.toString(16);
};

const btoa = (string) => {
  return Buffer.from(string, 'binary').toString('base64');
};

const wait = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

const isIpfsUrl = (url) => {
  return String(url).startsWith('ipfs://');
};

module.exports = {
  getMetadata,
  generateRelayMessages,
  generateValidatorMessages,
  getOwnerName,
  getRpcUrl,
  recoverAddressFromMessageAndSignature,
  convertDecimalToHexadecimal,
  btoa,
  wait,
  getRandomItem,
  isIpfsUrl,
};
