const { SUPPORTED_CHAINS } = require('../../constants');
const { redisClient } = require('../../redis');
const accountModel = require('../models/accounts');
const { isEthereumAddress, isEmail, isURL } = require('validator');

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
    const { address, email, description, profile, cover, social, collections } =
      req.body;

    const NewData = {
      email: '',
      walletAddress: '',
      description: '',
      profile: '',
      cover: '',
      verified: false,
      social: {},
      collections: [],
      followers: [],
    };
    //TODO handle images and upload it to IPFS

    //TODO data validation for existing inputs
    if (email && !isEmail(email)) {
      return res.status(400).json({ message: ' Invalid email' });
    }
    if (
      description &&
      (typeof description !== 'string' ||
        String(description).trim().length < 10 ||
        String(description).trim().length > 200)
    ) {
      return res
        .status(400)
        .json({ message: 'Description length should be between 10 and 200' });
    }
    if (profile && !isURL(profile)) {
      return res.status(400).json({ message: 'Invalid profile image URL' });
    }
    if (cover && !isURL(cover)) {
      return res.status(400).json({ message: 'Invalid cover image URL' });
    }
    if (
      social &&
      (typeof social !== 'object' ||
        !Object.values(social).reduce((result, current) => {
          return result && isURL(current);
        }, true))
    ) {
      return res.status(400).json({
        message:
          'social should be an object, the value to each key must be valid URLs',
      });
    }
    //! The validation below will need to be checked before merging into main branch
    if (collections && Array.isArray(collections)) {
      return res.status(400).json({
        message: 'collections must be array of (!!! slugs or CIDs)',
      });
    }
    //TODO finding an existing entry in DB

    //TODO creating new entry in the database if not exist
    //TODO update the entry in the database if does exist

    //TODO responding to request about what was updated
  } catch (error) {
    console.log(error);
  }
};
