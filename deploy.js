const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    // const MVDbxToken = await ethers.getContractFactory('MVDbxToken');
    // const token = await MVDbxToken.deploy(
    //     '500000000000000000000000', // assetCap
    //     '0x96f141F64A0D6Dd4Cde7Ab75D79BDbDBb393836E' // dataFeed address
    // );

    const USDToken = await ethers.getContractFactory('USDTContract');
    const USDT = await USDToken.deploy();

    await USDT.waitForDeployment();

    console.log('Token deployed to:', token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
