// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Coin {
  mapping (address => uint) balances;

  address public owner;
  uint public totalSupply = 0;
  uint public maxSupply = 1000000e18; // 1 000 000

  event Transfer(address from, address to, uint amount);

  modifier onlyOwner {
    require(msg.sender == owner, "New coins must be minted by contract owner.");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function mint(address recipient, uint amount) public onlyOwner {
    require(amount <= (maxSupply - totalSupply), "Coins to mint must be less than remaining supply.");
    balances[recipient] += amount;
    totalSupply += amount;
  }

  function transfer(address to, uint amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance!");
    balances[msg.sender] -= amount;
    balances[to] += amount;
    emit Transfer(msg.sender, to, amount);
  }

  function balanceOf(address account) public view returns (uint) {
    return balances[account];
  }
}