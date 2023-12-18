require('@nomicfoundation/hardhat-toolbox');

module.exports = {
    solidity: '0.8.19',
    networks: {
        binance: {
            url: 'https://bsc-testnet.publicnode.com',
            accounts: ['private key here'],
        },
    },
};
