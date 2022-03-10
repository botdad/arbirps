// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "ds-test/test.sol";

import "../AttestValidMoveVerifier.sol";
import "../RevealMoveVerifier.sol";

contract VerifiersTest is DSTest {
  function setUp() public {}

  function testValidMove() public {
    uint256[8] memory proof = [
      0x1b1744bbdbc3bbda29b497f764a75b6d684f8bdabd517f4678aa643b53663811,
      0x05032ac277ee8aaaeb885e353b181a9bc07371ba6689eea2bced9383aa9d0b53,
      0x060623691aa139448b43b0684d1b1398135806ac1a57a0aea6c70833036c3003,
      0x01cb73ab45c32c5357e2a45d012d94b71d250f310587c5ee4ce36faafe33fa3c,
      0x0173dc888028846c6052697b618edad3eccde09ec7ea5bf1cc8f644cc1b56495,
      0x0c909632d49a46293d687fbb512e8ea124a6a79805ed6dd78fe115799fb11af2,
      0x229b71d2cb3637543ee8e54842699146913c612b2c17abd2f89089019791a0ed,
      0x28e2ac14711f581fa428f928831b17b81a86233e2506624c2c51ed37e13f19e2
    ];

    uint256 input = 0x03a2ab5cebb2b82a7a52f9c15b47c39445b081d55b5c2dd7704b4ca61884d125;

    assertTrue(AttestValidMoveVerifier.verifyProof(proof, input));
  }

  function testRevealMove() public {
    uint256[8] memory proof = [
      0x156bdd64db1c75bf3df7e0bbc5cae03ca6a75e3a3aae836efad58ebd05bbb762,
      0x1fea27956b608f4dc3f842298d182b68038c056d3927b831bf3b6c582a0e2f42,
      0x2d5daf17f26dde5e3016c988678a5a5bde9deb9f495cfb033b954b98c4836561,
      0x134388a53553f45a0985237ca9dc326dbd07962ae15976d4490df735d8cc018a,
      0x0c63f4bc34765edd60898049b5eda684c0ae5968130df25369be8c4374097b90,
      0x1dbcaed8d29ead5d98ab2eb1e32aa98bb304cc7fb37dac548b5a901eebcf65f2,
      0x26b62ba6052cd4dd2d9820f4aad459245e787aa60363c6a0764ff55d776b99f8,
      0x036d55cbc51a5648fadf79d16128c546ef775e507f83f3321b3f99eae34a7bee
    ];

    uint256 moveAttestation = 0x03a2ab5cebb2b82a7a52f9c15b47c39445b081d55b5c2dd7704b4ca61884d125;

    // assertTrue(RevealMoveVerifier.verifyProof(proof, input));
    assertTrue(RevealMoveVerifier.verifyProof(proof, 1, moveAttestation));
  }
}
