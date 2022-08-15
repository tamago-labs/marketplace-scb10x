const axios = require('axios');

const { redisClient } = require('../../redis');
const { db } = require('../../firebase');

const getAccount = async (address) => {
  const collection = await db
    .collection('accounts-v2')
    .doc(String(address).toLowerCase())
    .get();
  if (!collection.exists) {
    return null;
  }
  return collection.data();
};

const createNewAccount = async (documentId, data) => {
  await db
    .collection('accounts-v2')
    .doc(String(documentId).toLowerCase())
    .set(data);
};

const updateAccount = async (documentId, data) => {
  await db
    .collection('accounts-v2')
    .doc(String(documentId).toLowerCase())
    .update(data);
};

module.exports = {
  getAccount,
  createNewAccount,
  updateAccount,
};
