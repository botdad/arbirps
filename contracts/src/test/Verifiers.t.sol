// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "ds-test/test.sol";

import "../AttestValidMoveVerifier.sol";
import "../RevealMoveVerifier.sol";

contract VerifiersTest is DSTest {
  function setUp() public {}

  function testValidMove() public {
    uint256[8] memory proof = [
      0x0cf98b78397c5bccdc77983a24e36599e31d3e15b4cb507dd0a8e3413c3e4baa,
      0x284953d4e19a91b8d7445be47421cda91234f2475e3efc7152d3b370292e1390,
      0x2c844102d2207df28892c008569d17c4aeaba3d26ee2f9e2db04ef6597e76e0d,
      0x038606cd88d2d14f51b6012e94c4f2f7890e8c3b88efac419094f579e5102b04,
      0x0b2128c32a2f6c017e94e25a20e81d985d070d2edd492a4abe6e29066845fd8d,
      0x2a8e29f6ac4e3d0c9012ce569426b96cc16d3772158bc3140883e2433139fe00,
      0x0e1884d6c2fb39bcb7053ea7483dee6184a3f47a30d48c0beef57a281cecd274,
      0x2a42815331fc8bba63681b80d4f9987797e300a20bbde19549d6c896ed86f72d
    ];

    uint256 input = 0x131e4d5462c64621113cdd27344ba7d6e44c69df619f8b5bcb3bafa5dcad80a3;

    assertTrue(AttestValidMoveVerifier.verifyProof(proof, input));
  }

  function testRevealMove() public {
    uint256[8] memory proof = [
      0x24e32fb7254fdd4a7d599a13463fc9f3ce1ccb5e321f419ad580d91f8ca07543,
      0x1ae3137d99fafffaec3af3d233a6bb31c22313d6a69d706afbd3b66fb0fb62ca,
      0x299a882182e3f31eea7ec7ec3ddeff3b961a5bc8ee6ded10af76eead34719477,
      0x1b7c1a0b0aef40d886f94578b444e115b8feffc5a887d3dbaef46c559f0ff036,
      0x205445998cd549a65f368fe291cdeb559d27db80de74abd1d3a206150ef41630,
      0x117648f09f767985b5998d4bfe0c7248e67b6517130a8127387ef89300371f8c,
      0x1fc64838fba3a2b32baa0ec3595b2594f98b8f911a924def9a96cc04675c1b01,
      0x1d55dd756c6f28c4faa5bf1745f398ba8b1fd50bc10619567f28036355585ab8
    ];

    uint256 moveAttestation = 0x03a2ab5cebb2b82a7a52f9c15b47c39445b081d55b5c2dd7704b4ca61884d125;

    // assertTrue(RevealMoveVerifier.verifyProof(proof, input));
    assertTrue(RevealMoveVerifier.verifyProof(proof, 1, moveAttestation));
  }
}
