/** @type import('hardhat/config').HardhatUserConfig */
const CHAIN_ID = {
    bnb: 56, // chain ID for hardhat testing
  };

const CHAIN_IDS = {
    hardhat: 31337, // chain ID for hardhat testing
  };
  module.exports = {
    networks: {
      hardhat: {
        chainId: CHAIN_ID.bnb,
        forking: {
          url: 'https://bsc-dataseed.binance.org/',
          blockNumber: 12821000, // a specific block number with which you want to work
        },
      },
    }
  }