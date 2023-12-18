const { ethers } = require('ethers');

const v2RouterAbi = require('./abi/abis__pancakeV2Router.json');
const v2RouterAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E'; // PancakeSwap V2 Router

const factoryAbi = require('./abi/abis__pancakeV2Factory.json');
const factoryAddress = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'; // PancakeSwap V2 Factory

const mvdbxAbi = require('./abi/abis__mvdbx.json');
const mvdbxAddress = '0x9A69f47BC75659e9263D342ea98D4f680f26C8FC'; // MVDBX Address

const tokenAbi = require('./abi/abis__erc20.json'); // USDT Token ABI
const tokenAddress = '0x55d398326f99059fF775485246999027B3197955'; // USDT Token Address

const main = async () => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(
            'https://bsc-dataseed.binance.org/'
        );

        const privateKey = 'private key here';
        const wallet = new ethers.Wallet(privateKey, provider);

        const factoryContract = new ethers.Contract(
            factoryAddress,
            factoryAbi,
            provider
        );

        const mvdbxContract = new ethers.Contract(
            mvdbxAddress,
            tokenAbi,
            wallet
        );

        const pairAddress = await factoryContract.getPair(
            mvdbxAddress,
            tokenAddress
        );

        console.log('pairAddress', pairAddress);

        const routerContract = new ethers.Contract(
            v2RouterAddress,
            v2RouterAbi,
            wallet
        );

        // Amount of MVDBX to swap (example: swapping 1 MVDBX)
        const amountIn = ethers.utils.parseUnits('1', 18); // MVDBX has 18 decimals

        // Set up swap parameters
        const amountOutMin = 0; // Minimum amount of USDT you'd like to receive, set to 0 for simplicity
        const path = [mvdbxAddress, tokenAddress];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

        // Execute the swap
        const swapTx =
            await routerContract.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                amountIn,
                amountOutMin,
                path,
                wallet.address,
                deadline
            );
        const receipt = await swapTx.wait();

        console.log('Transaction receipt:', receipt);
    } catch (error) {
        console.log({ error });
    }
};

main();