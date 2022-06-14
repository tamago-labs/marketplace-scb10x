require('dotenv').config()
/* import moralis */

const Moralis = require("moralis/node");

/* Moralis init code */

const MoralisOptions = {
  serverUrl: process.env.MORALIS_SERVER_URL,
  appId: process.env.MORALIS_APP_ID,
  masterKey: process.env.MORALIS_MASTER_KEY,
}

module.exports = {
  Moralis,
  MoralisOptions
}