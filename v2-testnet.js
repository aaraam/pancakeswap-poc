const { ethers } = require('ethers');

const tokenOneAddress = '0x7276B76AA81d5D37D2e7b4E3326B66aA71bb5036';
const tokenTwoAddress = '0x7179779592aB9666cadFf25A2c50458E90946dF7';

const pairAbi = require('./abi/abis__pairContract.json');
const pairAddress = '0x3F1C191E0254E7Ce5995D7ce65EB4D2424CbD7E0';

const factoryAbi = require('./abi/abis__pancakeV2Factory.json');
const factoryAddress = '0x6725F303b657a9451d8BA641348b6761A6CC7a17'; // PancakeSwap testnet V2 Factory

const v2RouterAbi = require('./abi/abis__pancakeV2Router.json');
const v2RouterAddress = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'; // PancakeSwap testnet V2 Router

const provider = new ethers.providers.JsonRpcProvider(
    'https://bsc-testnet.publicnode.com'
);

const singleHopSwapFromMVDBx = async () => {
    try {
        const wallet = new ethers.Wallet(
            'privatekey',
            provider
        );
        const routerContract = new ethers.Contract(
            v2RouterAddress,
            v2RouterAbi,
            wallet
        );

        // Amount of MVDBX to swap (example: swapping 1 MVDBX)
        const amountIn = ethers.utils.parseUnits('0.000001', 18); // MVDBX has 18 decimals

        // Set up swap parameters
        const amountOutMin = amountIn.div(4); // calculate amountOutMin as 25% of the amountIn
        const path = [tokenOneAddress, tokenTwoAddress];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

        // Execute the swap
        const swapTx = await routerContract.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            wallet.address,
            deadline,
            {
                gasLimit: 10000000,
                gasPrice: ethers.utils.parseUnits('5', 'gwei'),
            }
        );
        console.log('Transaction hash:', swapTx.hash);
        const receipt = await swapTx.wait();

        console.log('Transaction receipt:', receipt);
    } catch (error) {
        console.log(error);
    }
};

const singleHopSwapToMVDBx = async () => {
    try {
        const wallet = new ethers.Wallet(
            'privatekey',
            provider
        );
        const routerContract = new ethers.Contract(
            v2RouterAddress,
            v2RouterAbi,
            wallet
        );

        // Desired amount of tokens to receive
        const amountOut = ethers.utils.parseUnits('0.000000000001', 18);

        // // Amount of USDTTT to swap (example: swapping 200 USDTTT max)
        // const amountInMax = ethers.utils.parseUnits('100', 18); // USDTTT has 18 decimals

        // Calculate minimum amount out with 25% slippage tolerance
        const slippageTolerance = 0.25; // 25%
        // const amountOutMin = amountOut.mul(100 - slippageTolerance * 100).div(100);

        const amountInMax = ethers.utils.parseUnits('100', 18); // USDTTT has 18 decimals

        const path = [tokenTwoAddress, tokenOneAddress];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

        // Execute the swap
        const swapTx = await routerContract.swapTokensForExactTokens(
            amountOut,
            amountInMax,
            path,
            wallet.address,
            deadline,
            {
                gasLimit: 10000000,
                gasPrice: ethers.utils.parseUnits('5', 'gwei'),
            }
        );
        console.log('Transaction hash:', swapTx.hash);
        const receipt = await swapTx.wait();

        console.log('Transaction receipt:', receipt);
    } catch (error) {
        console.log(error);
    }
};

//calculate amount out
const calculateAmountOut = async () => {
    try {
        const wallet = new ethers.Wallet(
            'privatekey',
            provider
        );
        const routerContract = new ethers.Contract(
            v2RouterAddress,
            v2RouterAbi,
            wallet
        );

        // Desired amount of tokens to receive
        // const amountOut = ethers.utils.parseUnits('0.000000000001', 18);

        // // Amount of USDTTT to swap (example: swapping 200 USDTTT max)
        // const amountInMax = ethers.utils.parseUnits('100', 18); // USDTTT has 18 decimals

        // Calculate minimum amount out with 25% slippage tolerance
        // const slippageTolerance = 0.25; // 25%
        // const amountOutMin = amountOut.mul(100 - slippageTolerance * 100).div(100);

        const amountInMax = ethers.utils.parseUnits('100', 18); // USDTTT has 18 decimals

        const path = [tokenTwoAddress, tokenOneAddress];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

        // Execute the swap
        const amountOutMin = await routerContract.getAmountsOut(
            amountInMax,
            path
        );
        console.log('amountOutMin', amountOutMin.toString());
    } catch (error) {
        console.log(error);
    }
};

// get pair address from factory
const getPairAddress = async () => {
    try {
        const wallet = new ethers.Wallet(
            'privatekey',
            provider
        );
        const factoryContract = new ethers.Contract(
            factoryAddress,
            factoryAbi,
            wallet
        );

        const pairAddress = await factoryContract.getPair(
            tokenOneAddress,
            tokenTwoAddress
        );

        console.log('pairAddress', pairAddress);
    } catch (error) {
        console.log(error);
    }
};

// get reserves from pair contract
const getReserves = async () => {
    try {
        const wallet = new ethers.Wallet(
            'privatekey',
            provider
        );
        const pairContract = new ethers.Contract(pairAddress, pairAbi, wallet);

        const reserves = await pairContract.getReserves();

        console.log('reserves', reserves.toString());
    } catch (error) {
        console.log(error);
    }
};

// Calculate price impact
const calculatePriceImpact = async (
    amountIn,
    tokenInAddress,
    tokenOutAddress
) => {
    try {
        const factoryContract = new ethers.Contract(
            factoryAddress,
            factoryAbi,
            provider
        );

        // Get the pair address
        const pairAddress = await factoryContract.getPair(
            tokenInAddress,
            tokenOutAddress
        );
        const pairContract = new ethers.Contract(
            pairAddress,
            pairAbi,
            provider
        );

        // Get the reserves
        const reserves = await pairContract.getReserves();
        let reserveIn, reserveOut;
        if (tokenInAddress.toLowerCase() < tokenOutAddress.toLowerCase()) {
            reserveIn = reserves[0];
            reserveOut = reserves[1];
        } else {
            reserveIn = reserves[1];
            reserveOut = reserves[0];
        }

        // Calculate new reserves after swap
        const newReserveIn = reserveIn.add(amountIn);
        const newReserveOut = reserveOut.sub(amountIn); // Simplified, actual calculation may vary

        // Calculate price before and after swap
        const priceBefore = reserveOut.div(reserveIn);
        const priceAfter = newReserveOut.div(newReserveIn);

        // Calculate price impact
        const priceImpact = priceBefore
            .sub(priceAfter)
            .div(priceBefore)
            .mul(100);

        console.log('priceImpact', priceImpact.toString());
    } catch (error) {
        console.error(error);
        return null;
    }
};

// singleSwapFromMVDBx();
// singleHopSwapToMVDBx();
calculateAmountOut();
// getPairAddress();
// getReserves();
// const amountIn = ethers.utils.parseUnits('1', 18); // Example amount
// calculatePriceImpact(amountIn, tokenOneAddress, tokenTwoAddress)
//     .then(priceImpact => console.log('Price Impact:', priceImpact.toString()))
//     .catch(error => console.error(error));
