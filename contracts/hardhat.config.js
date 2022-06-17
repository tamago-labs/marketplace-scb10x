require("dotenv").config()

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  mocha: {
    timeout: 1200000,
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      // forking: {
      //   url: process.env.POLYGON_URL,
      //   blockNumber: 20480699,
      // },
      forking: {
        url: process.env.MAINNET_ARCHIVE_RPC,
        accounts: [process.env.PRIVATEKEY_DEPLOYER, process.env.PRIVATEKEY_DEV],
        // blockNumber: 13975629,
      },
    },
    mainnet: {
      allowUnlimitedContractSize: true,
      url: process.env.MAINNET_URL,
      accounts: [process.env.PRIVATEKEY_DEPLOYER, process.env.PRIVATEKEY_DEV],
    },
    polygon: {
      allowUnlimitedContractSize: true,
      url: process.env.POLYGON_URL,
      accounts: [process.env.PRIVATEKEY_DEPLOYER, process.env.PRIVATEKEY_DEV],
    },
    mumbai: {
      allowUnlimitedContractSize: true,
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: [process.env.PRIVATEKEY_DEPLOYER, process.env.PRIVATEKEY_DEV],
    },
    harmony: {
      allowUnlimitedContractSize: true,
      url: "https://rpc.s1.t.hmny.io",
      accounts: [process.env.PRIVATEKEY_DEPLOYER, process.env.PRIVATEKEY_DEV],
    },
    bsc: {
      allowUnlimitedContractSize: true,
      url: "https://bsc-dataseed.binance.org/",
      accounts: [process.env.PRIVATEKEY_DEPLOYER, process.env.PRIVATEKEY_DEV],
    },
    bscTestnet: {
      allowUnlimitedContractSize: true,
      url: "https://speedy-nodes-nyc.moralis.io/2041771c8a1a3004b1608ea7/bsc/testnet",
      accounts: [process.env.PRIVATEKEY_DEPLOYER, process.env.PRIVATEKEY_DEV],
    },
    mainnetfork: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIVATEKEY_DEPLOYER, process.env.PRIVATEKEY_DEV],
      timeout: 500000,
    },
    kovan: {
      allowUnlimitedContractSize: true,
      url: "https://speedy-nodes-nyc.moralis.io/2041771c8a1a3004b1608ea7/eth/kovan",
      accounts: [process.env.PRIVATEKEY_DEPLOYER, process.env.PRIVATEKEY_DEV],
      timeout: 500000,
    },
    avaxTestnet: {
      allowUnlimitedContractSize: true,
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATEKEY_DEPLOYER, process.env.PRIVATEKEY_DEV],
      timeout: 500000,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    dev: {
      default: 1,
    },
  },
  etherscan: {
    apiKey: process.env.BSC_API_KEY,
  },
};
