const { ethers } = require('ethers');

const tokenOneAddress = '0x9A69f47BC75659e9263D342ea98D4f680f26C8FC';
const tokenTwoAddress = '0x55d398326f99059fF775485246999027B3197955';

const factoryAbi = require('../abi/abis__pancakeV2Factory.json');
const factoryAddress = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'; // PancakeSwap V2 Factory

const v2RouterAbi = require('../abi/abis__pancakeV2Router.json');
const v2RouterAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E'; // PancakeSwap V2 Router

const provider = new ethers.providers.JsonRpcProvider(
    'https://bsc-dataseed.binance.org/'
);

// Describe the test suite
describe('v2 pancake swap tests on bsc testnet', () => {
    // test if we can see if the [air exists
    test('test if pair exists', async () => {
        const factoryContract = new ethers.Contract(
            factoryAddress,
            factoryAbi,
            provider
        );

        const pairAddress = await factoryContract.getPair(
            tokenOneAddress,
            tokenTwoAddress
        );

        console.log(pairAddress);

        // expect pair address note to be zero address
        expect(pairAddress).not.toBe('0x0000');
    });
});
