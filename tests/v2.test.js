const { ethers } = require('ethers');

const tokenOneAddress = '0x7276B76AA81d5D37D2e7b4E3326B66aA71bb5036';
const tokenTwoAddress = '0x7179779592aB9666cadFf25A2c50458E90946dF7';

const factoryAbi = require('../abi/abis__pancakeV2Factory.json');
const factoryAddress = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'; // PancakeSwap testnet V2 Factory

const v2RouterAbi = require('../abi/abis__pancakeV2Router.json');
const v2RouterAddress = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'; // PancakeSwap testnet V2 Router

const provider = new ethers.providers.JsonRpcProvider(
    'https://bsc-testnet.publicnode.com'
);

// Describe the test suite
describe('v2 pancake swap tests on bsc testnet', () => {
    // // test if we can see if the pair exists
    // test('test if pair exists', async () => {
    //     const factoryContract = new ethers.Contract(
    //         factoryAddress,
    //         factoryAbi,
    //         provider
    //     );

    //     const pairAddress = await factoryContract.getPair(
    //         tokenOneAddress,
    //         tokenTwoAddress
    //     );

    //     console.log(pairAddress);

    //     // expect pair address note to be zero address
    //     expect(pairAddress).not.toBe('0x0000');
    // });

    test('test if we can swap tokens', async () => {

        const wallet = new ethers.Wallet('privatekey', provider);
        const routerContract = new ethers.Contract(
            v2RouterAddress,
            v2RouterAbi,
            wallet
        );

        // Amount of MVDBX to swap (example: swapping 1 MVDBX)
        const amountIn = ethers.utils.parseUnits('0.000001', 18); // MVDBX has 18 decimals

        // Set up swap parameters
        const amountOutMin = 0; // Minimum amount of USDT you'd like to receive, set to 0 for simplicity
        const path = [tokenOneAddress, tokenTwoAddress];
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
    });
});
