// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "ds-test/test.sol";
import "./Vm.sol";
import "./MockMinimalErc721.sol";

import "../ArbibotRPS.sol";

contract ArbibotRPSTest is DSTest {
  Vm vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

  MockMinimalErc721 erc721;
  ArbibotRPS rps;

  function setUp() public {
    erc721 = new MockMinimalErc721();
    erc721.setOwner(address(this));

    rps = new ArbibotRPS(address(erc721));
  }

  uint256[8][3] moveProofUints = [
    [
      0x1d5e9820d97f6964dee4d8699c1190b6795ac06364d6ea3dd3d8f6e3b4a0ee84,
      0x1a9b582b308d4f5c3dc76c0eab1981d9811b83527916d1dc9430e9db5c3d4a8e,
      0x2537ead6472e6ac17a60cd7633f05f7f098959223fefc12da6dcb7d4213a09bc,
      0x0a759ae5b3cb804293a6f648332feb8020b359290f48099ecc5209ee45e81f53,
      0x16bd80733c68d72899012d43bd5d1c9feacbb881d412c9f187d49a752a563808,
      0x1b1b6399510b1c4180b3cc960cb9ce01206d4edef3fa454348d4bf4ebc13eb5e,
      0x286f598dfad983b8467954daf5f079580379984add2e1632b405f818fa4f5b9c,
      0x143dd2964c4b611e13defcec98d4eba3e6e45107ae924ced352f16f063f62f1e
    ],
    [
      0x1b1744bbdbc3bbda29b497f764a75b6d684f8bdabd517f4678aa643b53663811,
      0x05032ac277ee8aaaeb885e353b181a9bc07371ba6689eea2bced9383aa9d0b53,
      0x060623691aa139448b43b0684d1b1398135806ac1a57a0aea6c70833036c3003,
      0x01cb73ab45c32c5357e2a45d012d94b71d250f310587c5ee4ce36faafe33fa3c,
      0x0173dc888028846c6052697b618edad3eccde09ec7ea5bf1cc8f644cc1b56495,
      0x0c909632d49a46293d687fbb512e8ea124a6a79805ed6dd78fe115799fb11af2,
      0x229b71d2cb3637543ee8e54842699146913c612b2c17abd2f89089019791a0ed,
      0x28e2ac14711f581fa428f928831b17b81a86233e2506624c2c51ed37e13f19e2
    ],
    [
      0x09a261f1f7b3401d57948c50e633a2fb9167129111a0d199ac9bd02b8099de91,
      0x19ade9d387c9f53a04e95c901f59215d199b397ec00ff071ff12ea5e7729f5d5,
      0x227019ed0377796104487f2f8702f400f9b5d30e885d038cf94add8da78be8a2,
      0x24ba3b9003b3ebfa9b20d7d81f231b0de7e3139638f32ff5ea91c06f1a438fa5,
      0x16419ffb05405fb8206c1620fd0bda19106fa1ef6607b65dcb71aad1eb5dddda,
      0x02d283fbbeb3fcce3ca7cda78ae9e62ae150d1540fc3bcd499409d44226c4ac3,
      0x1d57529dc124b553789d7333f1867174be3016345d87997f85f131f50f323c7f,
      0x108b37414acef7a02c133513b5012efd58925b17cf5a716d799b2cb573ca6665
    ]
  ];

  uint256[3] moveInputs = [
    0x131e4d5462c64621113cdd27344ba7d6e44c69df619f8b5bcb3bafa5dcad80a3,
    0x03a2ab5cebb2b82a7a52f9c15b47c39445b081d55b5c2dd7704b4ca61884d125,
    0x1fb12b3564d6c736426e1886274d8091949949380d01997db78f2252df559ad5
  ];

  uint256[8][3] revealProofUints = [
    [
      0x277ce98885563bc3fb5a57c9cd894c3edcbe8acf161cb1ad5159bbf30df5e4be,
      0x1589d97b495ab572e89948b8ec9d3caf2df181a51a460087d92423e402327960,
      0x0fe81d4aa4f3a9f1e2e753fb6e4a28184065c00e1403db1a0b2f5427a04d759d,
      0x17cec815eb90f9dbbfc6ec7dc5a52212162d4c039637d3c0c7f38c4cb87c1633,
      0x1da472cdcb03ec6b87b79ef1dd18425aac270f2c79980bf9d0fa04e6557d9c91,
      0x2d9cc9cb7cca0d2b51f77aba335a7911e82a5c83910cace09518485d4822ece3,
      0x0dbc6f404882858d060a1a4d2f61f710ca3ef05aa5a27cf753435a54525076b2,
      0x15557324d5ecbe41c8285aebbf570955f41f6a561f255fe8337cc0a8d394dee9
    ],
    [
      0x156bdd64db1c75bf3df7e0bbc5cae03ca6a75e3a3aae836efad58ebd05bbb762,
      0x1fea27956b608f4dc3f842298d182b68038c056d3927b831bf3b6c582a0e2f42,
      0x2d5daf17f26dde5e3016c988678a5a5bde9deb9f495cfb033b954b98c4836561,
      0x134388a53553f45a0985237ca9dc326dbd07962ae15976d4490df735d8cc018a,
      0x0c63f4bc34765edd60898049b5eda684c0ae5968130df25369be8c4374097b90,
      0x1dbcaed8d29ead5d98ab2eb1e32aa98bb304cc7fb37dac548b5a901eebcf65f2,
      0x26b62ba6052cd4dd2d9820f4aad459245e787aa60363c6a0764ff55d776b99f8,
      0x036d55cbc51a5648fadf79d16128c546ef775e507f83f3321b3f99eae34a7bee
    ],
    [
      0x13aed84ab61a28c0f082ed65629406d41923cfca90eabd11a7012a2ea63ed826,
      0x0d9e35802a9d8bf8b88fec079bf0af5ddb16d006809a8b9bc0d5e1a889dc7423,
      0x035c1420414591688e7b2f62fc74ddcbbcd32a28908e28050021331cd0d3a15d,
      0x1157b81b9d4e06807c60e557a804faf12aa2f550282f2277c2586b8c1ab6798b,
      0x0d3819e54708e24445149eda6bc91dad9d9635b870398347c2afc6573b9ed60d,
      0x147cb6c2846318cd0d6d59bdc059ddb857c53b98bbc8d3365894666c1a2ead49,
      0x2f81034433a63b0f4654d2e0c1dc1d8fd471db7c7aa7ad28cd4619a25e1f6f7e,
      0x190b9cb04d6d29609f5ab5c0d4b774044337042fb69cbae9ba5039990082a7cf
    ]
  ];

  uint256[4][3] revealInputs = [
    [
      0x0000000000000000000000000000000000000000000000000000000000000001,
      0x0000000000000000000000000000000000000000000000000000000000000000,
      0x0000000000000000000000000000000000000000000000000000000000000000,
      0x131e4d5462c64621113cdd27344ba7d6e44c69df619f8b5bcb3bafa5dcad80a3
    ],
    [
      0x0000000000000000000000000000000000000000000000000000000000000000,
      0x0000000000000000000000000000000000000000000000000000000000000001,
      0x0000000000000000000000000000000000000000000000000000000000000000,
      0x03a2ab5cebb2b82a7a52f9c15b47c39445b081d55b5c2dd7704b4ca61884d125
    ],
    [
      0x0000000000000000000000000000000000000000000000000000000000000000,
      0x0000000000000000000000000000000000000000000000000000000000000000,
      0x0000000000000000000000000000000000000000000000000000000000000001,
      0x1fb12b3564d6c736426e1886274d8091949949380d01997db78f2252df559ad5
    ]
  ];

  function testStartRound() public {
    bytes memory proof = abi.encode(moveProofUints[0]);
    uint256 arbibotId = 0;

    uint256 roundBefore = rps.totalRounds();
    uint256 nonceBefore = rps.nonces(arbibotId);

    rps.startRound(arbibotId, proof, moveInputs[0]);

    (
      uint256 arbibotId1,
      uint256 arbibotId2,
      uint256 winner,
      uint256 move1Attestation,
      uint8 move1,
      uint8 move2,
      bool ended
    ) = rps.rounds(roundBefore);
    assertEq(arbibotId1, arbibotId);
    assertEq(arbibotId2, 0);
    assertEq(winner, 0);
    assertEq(move1Attestation, moveInputs[0]);
    assertEq(move1, rps.DEAD_MOVE());
    assertEq(move2, rps.DEAD_MOVE());
    assertTrue(!ended);

    uint256 roundAfter = rps.totalRounds();
    assertEq(roundBefore + 1, roundAfter);

    uint256 nonceAfter = rps.nonces(arbibotId);
    assertEq(nonceBefore + 1, nonceAfter);
  }

  function testSubmitMove2() public {
    bytes memory proof = abi.encode(moveProofUints[0]);
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move = 1;

    uint256 roundId = rps.totalRounds();
    rps.startRound(arbibotId1, proof, moveInputs[0]);
    rps.submitMove2(arbibotId2, roundId, move);

    (, uint256 _arbibotId2, uint256 winner, , uint8 move1, uint8 move2, bool ended) = rps.rounds(roundId);
    assertEq(_arbibotId2, arbibotId2);
    assertEq(winner, 0);
    assertEq(move1, rps.DEAD_MOVE());
    assertEq(move2, move);
    assertTrue(!ended);
  }

  function testEndRound() public {
    bytes memory startProof = abi.encode(moveProofUints[0]);
    bytes memory revealProof = abi.encode(revealProofUints[0]);
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move = 1;

    uint256 roundId = rps.totalRounds();
    rps.startRound(arbibotId1, startProof, moveInputs[0]);
    rps.submitMove2(arbibotId2, roundId, move);
    rps.endRound(arbibotId1, roundId, revealProof, revealInputs[0]);

    (
      uint256 _arbibotId1,
      uint256 _arbibotId2,
      uint256 winner,
      uint256 move1Attestation,
      uint8 move1,
      uint8 move2,
      bool ended
    ) = rps.rounds(roundId);
    assertEq(_arbibotId1, arbibotId1);
    assertEq(_arbibotId2, arbibotId2);
    assertEq(winner, arbibotId2);
    assertEq(move1Attestation, moveInputs[0]);
    assertEq(move1, 0);
    assertEq(move2, 1);
    assertTrue(ended);
  }

  function testAllWinnerCombos() public {
    for (uint8 i = 0; i < 3; i++) {
      for (uint8 j = 0; j < 3; j++) {
        bytes memory startProof = abi.encode(moveProofUints[i]);
        bytes memory revealProof = abi.encode(revealProofUints[i]);
        uint256 arbibotId1 = 0;
        uint256 arbibotId2 = 1;
        uint8 move = j;

        uint256 roundId = rps.totalRounds();
        rps.startRound(arbibotId1, startProof, moveInputs[i]);
        rps.submitMove2(arbibotId2, roundId, move);
        rps.endRound(arbibotId1, roundId, revealProof, revealInputs[i]);

        (, , uint256 winner, , , , ) = rps.rounds(roundId);
        if (i == j) {
          assertEq(winner, 0);
        }

        if (i == 0 && j == 1) {
          // rock vs paper, paper wins
          assertEq(winner, arbibotId2);
        }

        if (i == 0 && j == 2) {
          // rock vs scissor, rock wins
          assertEq(winner, arbibotId1);
        }

        if (i == 1 && j == 0) {
          // paper vs rock, paper wins
          assertEq(winner, arbibotId1);
        }

        if (i == 1 && j == 2) {
          // paper vs scissors, scissors wins
          assertEq(winner, arbibotId2);
        }

        if (i == 2 && j == 0) {
          // scissors vs rock, rock wins
          assertEq(winner, arbibotId2);
        }

        if (i == 2 && j == 1) {
          // scissors vs paper, scissors wins
          assertEq(winner, arbibotId1);
        }
      }
    }
  }

  function testSubmitMoveInvalid() public {
    bytes memory startProof = abi.encode(moveProofUints[0]);
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move = 3;

    uint256 roundId = rps.totalRounds();
    rps.startRound(arbibotId1, startProof, moveInputs[0]);

    vm.expectRevert(abi.encodePacked(bytes4(keccak256("ErrorInvalidMove()"))));
    rps.submitMove2(arbibotId2, roundId, move);
  }

  function testSubmitMove2Twice() public {
    bytes memory startProof = abi.encode(moveProofUints[0]);
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move1 = 1;
    uint8 move2 = 1;

    uint256 roundId = rps.totalRounds();
    rps.startRound(arbibotId1, startProof, moveInputs[0]);
    rps.submitMove2(arbibotId2, roundId, move1);

    vm.expectRevert(abi.encodePacked(bytes4(keccak256("ErrorRoundHasMove()"))));
    rps.submitMove2(arbibotId2, roundId, move2);
  }

  function testEndRoundMismatchedAttestation() public {
    bytes memory startProof = abi.encode(moveProofUints[0]);
    bytes memory revealProof = abi.encode(revealProofUints[1]);
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move = 1;

    uint256 roundId = rps.totalRounds();
    rps.startRound(arbibotId1, startProof, moveInputs[0]);
    rps.submitMove2(arbibotId2, roundId, move);
    vm.expectRevert(abi.encodePacked(bytes4(keccak256("ErrorUnauthorized()"))));
    rps.endRound(arbibotId1, roundId, revealProof, revealInputs[1]);
  }
}
