// SPDX-License-Identifier: UNLICENCED
pragma solidity ^0.8.0;

contract Game {
  uint chngPlyrLvlWaitTime = 0;
  uint public playerCount = 0;

  enum Level { Beginner, Intermediate, Advance }

  struct Player {
    uint id;
    string name;
    Level playerLevel;
    uint createdTime;
  }

  mapping(address => Player) public players;

  constructor(uint _chngPlyrLvlWaitTime) {
    chngPlyrLvlWaitTime = _chngPlyrLvlWaitTime;
  }

  function addPlayer(string memory name) public {
    playerCount += 1;
    players[msg.sender] = Player(playerCount, name, Level.Beginner, block.timestamp);
  }

  function changePlayerLevel(address playerAddress, uint8 level) public {
    Player storage player = players[playerAddress];
    require(block.timestamp >= player.createdTime + chngPlyrLvlWaitTime, "Please wait for sometime to change player level");
    require(level <= uint8(Level.Advance), "Level must be from 0 to 2");
    player.playerLevel = Level(level);
  }

  function getPlayerLevel(address playerAddress) public view returns(Level) {
    Player memory player = players[playerAddress];
    return player.playerLevel;
  }
}