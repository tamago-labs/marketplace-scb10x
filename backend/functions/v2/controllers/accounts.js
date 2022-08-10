const { SUPPORTED_CHAINS } = require('../../constants');
const { redisClient } = require('../../redis');
const accountModel = require('../models/accounts');
const { isEthereumAddress } = require('validator');

exports.getAccount = async (req, res, next) => {
  try {
    // inputs
    const { address } = req.params;
    // validate the address
    if (!isEthereumAddress(address)) {
      return res.status(400).json({ message: 'Invalid Address Format' });
    }
    // get the address from db
    const account = await accountModel.getAccount(address);
    // return empty if not found
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    // return data if found
    return res.json({ status: 'ok', account });
  } catch (error) {
    next(error);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const NewData = {
      email: '',
      walletAddress: '',
      description: '',
      profile: '',
      cover: '',
      verified: false,
      social: [
        {
          twitter: '',
        },
      ],
      collections: [{}],
      followers: [],
    };
    //TODO use multer to handle images and upload it to IPFS

    //TODO recover address from message and signature to authorize

    //TODO data validation

    //TODO finding an existing entry in DB

    //TODO creating new entry in the database if not exist
    //TODO update the entry in the database if does exist

    //TODO responding to request about what was updated
  } catch (error) {
    console.log(error);
  }
};
