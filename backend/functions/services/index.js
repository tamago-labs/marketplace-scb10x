const { ethers } = require("ethers");

exports.getProvider = (rpcUrl) => {
  return new ethers.providers.JsonRpcProvider(rpcUrl)
}
