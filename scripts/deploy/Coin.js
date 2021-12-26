const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log(`Deploying contract with address: ${deployer.address}`);

  const Coin = await ethers.getContractFactory('Coin');
  const coin = await Coin.deploy();
  await coin.deployed();

  console.log(`Contract deployed at: ${coin.address}`);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});