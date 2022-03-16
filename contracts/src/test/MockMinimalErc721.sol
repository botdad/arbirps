// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../IMinimalERC721.sol";

contract MockMinimalErc721 is IMinimalERC721 {
  address public owner;
  address public owner2;

  function setOwner(address _owner) external {
    owner = _owner;
  }

  function setOwner2(address _owner) external {
    owner2 = _owner;
  }

  function ownerOf(uint256 id) external view returns (address) {
    if (id == 2) {
      return owner2;
    }
    return owner;
  }
}
