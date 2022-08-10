const axios = require('axios');

const { redisClient } = require('../../redis');
const { db } = require('../../firebase');

const getAccount = async (address) => {
  const collection = await db
    .collection('accounts-v2')
    .doc(String(address).toLowerCase())
    .get();
  if (collection.isEmpty) {
    return;
  }
  return collection.data();
};

module.exports = {
  getAccount,
};
