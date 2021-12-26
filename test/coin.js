const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

describe('Coin Contract', () => {
  let owner;
  let account1;
  let account2;
  let coin;
  const totalSupply = 0;
  const maxSupply = ethers.utils.parseEther('1000000');

  beforeEach(async () => {
    [owner, account1, account2] = await ethers.getSigners();

    const Coin = await ethers.getContractFactory('Coin');
    coin = await Coin.deploy();
    await coin.deployed();
  });

  describe('Deployment', () => {
    it('Sets the correct meta data', async () => {
      expect(await coin.totalSupply()).to.be.equals(totalSupply);
      expect(await coin.maxSupply()).to.be.equals(maxSupply);
    });

    it('Sets the correct owner', async () => {
      expect(await coin.owner()).to.be.equals(owner.address);
    });
  });

  describe('Mint function', () => {
    it('Mint new coin to any address, this updates balances and totalSupply', async () => {
      const mintAmount = ethers.utils.parseEther('100000');
      const tx = await coin.mint(owner.address, mintAmount);
      await tx.wait();

      expect(await coin.totalSupply()).to.be.equals(mintAmount);
      expect(await coin.balanceOf(owner.address)).to.be.equals(mintAmount);
    });

    it('Fails if anyone except owner mints new coins', async () => {
      await expect(
        coin
          .connect(account1)
          .mint(owner.address, ethers.utils.parseEther('100000'))
      ).to.be.revertedWith('New coins must be minted by contract owner.');
    });

    it('Fails if amount to mint coin is greater than remaining supply', async () => {
      await expect(coin.mint(owner.address, maxSupply + 1)).to.be.revertedWith(
        'Coins to mint must be less than remaining supply.'
      );
    });
  });

  describe('Transfer Function', () => {
    it('Transfer amount between accounts', async () => {
      // Mint new coins to owner
      const mintAmount = ethers.utils.parseEther('100000');
      const tx = await coin.mint(owner.address, mintAmount);
      await tx.wait();
      expect(await coin.balanceOf(owner.address)).to.be.equals(mintAmount);

      // transfer from owner to account 1
      const transferAmount = ethers.utils.parseEther('50000');
      const tx1 = await coin.transfer(account1.address, transferAmount);
      await tx1.wait();
      expect(await coin.balanceOf(account1.address)).to.be.equals(
        transferAmount
      );

      // transfer from account1 to account2
      const transferAmount2 = ethers.utils.parseEther('25000');
      const tx2 = await coin
        .connect(account1)
        .transfer(account2.address, transferAmount2);
      await tx2.wait();
      expect(await coin.balanceOf(account2.address)).to.be.equals(
        transferAmount2
      );
    });

    it('Fails if senders balance is less then transfer amount', async () => {
      await expect(coin.transfer(owner.address, 1000)).to.be.revertedWith(
        'Insufficient balance!'
      );
    });

    it('Emit transfer event on transfering amount', async () => {
      // Mint new coins to owner
      const mintAmount = ethers.utils.parseEther('100000');
      const tx = await coin.mint(owner.address, mintAmount);
      await tx.wait();
      expect(await coin.balanceOf(owner.address)).to.be.equals(mintAmount);

      await expect(coin.transfer(account1.address, mintAmount))
        .to.be.emit(coin, 'Transfer')
        .withArgs(owner.address, account1.address, mintAmount);
    });
  });
});
