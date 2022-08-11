const { isEthereumAddress, isEmail, isURL } = require('validator');

const { SUPPORTED_CHAINS } = require('../../constants');
const { redisClient } = require('../../redis');
const { isIpfsUrl } = require('../../utils');
const accountModel = require('../models/accounts');
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

    //data validation for existing inputs
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
    if (profile && !(isURL(profile) || isIpfsUrl(profile))) {
      return res.status(400).json({ message: 'Invalid profile image URL' });
    }
    if ((cover && !isURL(cover)) || isIpfsUrl(cover)) {
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
    if (
      collections &&
      (!Array.isArray(collections) ||
        !collections.reduce((result, current) => {
          return result && typeof current === 'string';
        }, true))
    ) {
      return res.status(400).json({
        message: 'collections must be array of (!!! slugs / CIDs / urls)',
      });
    }
    // finding an existing entry in DB
    const account = await accountModel.getAccount(address);
    if (account === null) {
      // creating new entry in the database if not exist
      const newData = {
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
      //email
      if (!email) {
        return res
          .status(400)
          .json({ message: 'email is required for creating account' });
      }
      //address
      if (!address) {
        return res
          .status(400)
          .json({ message: 'wallet address is required for creating account' });
      }
      //description
      if (!description) {
        return res.status(400).json({
          message:
            'description is required,length should be between 10 and 200',
        });
      }
      newData.email = email;
      newData.walletAddress = address;
      newData.description = description;
      if (profile) {
        newData.profile = profile;
      }
      if (cover) {
        newData.cover = cover;
      }
      if (social) {
        newData.social = social;
      }
      if (collections) {
        newData.collections = collections;
      }
      await accountModel.createNewAccount(address, newData);
      return res.status(201).json({ status: 'ok', newAccount: newData });
    }
    // update the entry in the database if does exist
    const newData = { ...account };
    if (email) {
      newData.email = email;
    }
    if (description) {
      newData.description = description;
    }
    if (profile) {
      newData.profile = profile;
    }

    if (cover) {
      newData.cover = cover;
    }
    if (social) {
      newData.social = { ...social, ...newData.social };
    }
    if (collections) {
      newData.collections = [...newData.collections, ...collections];
    }

    await accountModel.updateAccount(address, newData);
    return res.status(200).json({ status: 'ok', updatedAccount: newData });
  } catch (error) {
    console.log(error);
  }
};
