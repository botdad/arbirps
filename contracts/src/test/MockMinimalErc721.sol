// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../IMinimalERC721.sol";

contract MockMinimalErc721 is IMinimalERC721 {
  address public owner;

  function setOwner(address _owner) external {
    owner = _owner;
  }

  function ownerOf(uint256) external view returns (address) {
    return owner;
  }
}
