// SPDX-License-Identifier: UNLICENCED
pragma solidity ^0.8.0;

contract Game {
  uint contractCtreationTime;
  uint chngPlyrLvlWaitTime = 0;
  uint public playerCount = 0;

  enum Level { Beginner, Intermediate, Advance }

  struct Player {
    uint id;
    string name;
    Level playerLevel;
  }

  mapping(address => Player) public players;

  constructor(uint _chngPlyrLvlWaitTime) {
    chngPlyrLvlWaitTime = _chngPlyrLvlWaitTime;
    contractCtreationTime = block.timestamp;
  }

  function addPlayer(string memory name) public {
    playerCount += 1;
    players[msg.sender] = Player(playerCount, name, Level.Beginner);
  }

  function changePlayerLevel(address playerAddress, uint8 level) public {
    require(block.timestamp >= contractCtreationTime + chngPlyrLvlWaitTime, "Please wait for sometime to change player level");
    require(level <= uint8(Level.Advance), "Level must be from 0 to 2");
    players[playerAddress].playerLevel = Level(level);
  }

  function getPlayerLevel(address playerAddress) public view returns(Level) {
    Player memory player = players[playerAddress];
    return player.playerLevel;
  }
}