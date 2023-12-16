const { ethers } = require('ethers');

const smartRouterAbi = require('./abi/abis__pancakeSmartRouter.json');
const smartRouterAddress = '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4';

const factoryAbi = require('./abi/abis__pancakeSwapFactory.json');
const factoryAddress = '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865';

const mvdbxAbi = require('./abi/abis__mvdbx.json');
const mvdbxAddress = '0x9A69f47BC75659e9263D342ea98D4f680f26C8FC';
const tokenAbi = require('./abi/abis__erc20.json'); // cake
const tokenAddress = '0x55d398326f99059fF775485246999027B3197955'; // cake

const main = async () => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(
            'https://bsc-dataseed.binance.org/'
        );

        const factoryContract = new ethers.Contract(
            factoryAddress,
            factoryAbi,
            provider
        );

        const poolAddress = await factoryContract.getPool(
            mvdbxAddress,
            tokenAddress,
            '500'
        );
        console.log('poolAddress', poolAddress);
    } catch (error) {
        console.log({ error });
    }
};

main();
