require('@nomicfoundation/hardhat-toolbox');

module.exports = {
    solidity: '0.8.20',
    networks: {
        binance: {
            url: 'https://bsc-testnet.publicnode.com',
            accounts: ['private key goes here'],
        },
    },
};
