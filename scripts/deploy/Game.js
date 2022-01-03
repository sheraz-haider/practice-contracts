const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying Contract with ${deployer.address}`);

  const Game = await ethers.getContractFactory('Game');
  const game = await Game.deploy(604800); // 1 week
  await game.deployed();

  console.log(`Contract Deployed at ${game.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
