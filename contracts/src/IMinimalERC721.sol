// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IMinimalERC721 {
  function ownerOf(uint256 tokenId) external view returns (address owner);
}
