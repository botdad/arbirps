// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "ds-test/test.sol";
import "./Vm.sol";
import "./MockMinimalErc721.sol";
import "./TestErc20.sol";

import "../ArbibotRPS.sol";

contract ArbibotRPSTest is DSTest {
  Vm vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
  uint256 somePrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
  address someAddress = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
  uint256 otherPrivateKey = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;
  address otherAddress = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

  MockMinimalErc721 erc721;
  TestERC20 erc20;
  ArbibotRPS rps;

  function setUp() public {
    erc721 = new MockMinimalErc721();
    erc721.setOwner(address(this));

    erc20 = new TestERC20("botgold", "BGLD", 18);

    rps = new ArbibotRPS(address(erc721), address(erc20));
  }

  uint256[8][3] moveProofUints = [
    [
      0x0cf98b78397c5bccdc77983a24e36599e31d3e15b4cb507dd0a8e3413c3e4baa,
      0x284953d4e19a91b8d7445be47421cda91234f2475e3efc7152d3b370292e1390,
      0x2c844102d2207df28892c008569d17c4aeaba3d26ee2f9e2db04ef6597e76e0d,
      0x038606cd88d2d14f51b6012e94c4f2f7890e8c3b88efac419094f579e5102b04,
      0x0b2128c32a2f6c017e94e25a20e81d985d070d2edd492a4abe6e29066845fd8d,
      0x2a8e29f6ac4e3d0c9012ce569426b96cc16d3772158bc3140883e2433139fe00,
      0x0e1884d6c2fb39bcb7053ea7483dee6184a3f47a30d48c0beef57a281cecd274,
      0x2a42815331fc8bba63681b80d4f9987797e300a20bbde19549d6c896ed86f72d
    ],
    [
      0x0ebc8e6cbf21f995924241f31b9d4e1d7d3cf355c0af7da823e65b301dee674c,
      0x113cfb302c3520c2bdc00eddb1bfdd31a2916b8b01eee1f85a638da586ae5be2,
      0x2442214a17831d23525bf538b97b0a3ffa4997114f5f71fd79c06273d2f39724,
      0x0bda0bf35737ed21d0e5d21aa9f901480806638d653c8b6eb44a19a25f146208,
      0x1fb3294bba6a6c0e6f0140cc109022a313f54ab7e4e99082267d3e129212eae6,
      0x06c59436788740266606f7aff3fb7a2023fe8c5edcc4eb9ed62e34425d3eecd4,
      0x12bba6f33061dee43103a31f2e69386ed842d8e28e742d65e2016f3c718982d6,
      0x11aa5ab1478dbea8ebc0a60440c9cc36f2c6d332b992d782438982c56527072a
    ],
    [
      0x2165854a17804480448228ba259980359fc89f2052ec6da40c205374546b0677,
      0x03623a3231dfcdae8fe9e074fe1ba7d395d3fc59af09f40ad5be3d479997af3a,
      0x0fab56775759328d1594993d112cf9fe669181e6b291d76ddb8a7f4cc35c0ea4,
      0x0797d32c0bdf5613bb8d519e83057ec6d97541b1d1fbab498267fd2ca73baf2d,
      0x205568529bfbc5d1fbd7e88497538ee6edf381d51759fcae132d8504715d6c8a,
      0x2546300cf71c3871da91213e8db06d07dc0dc24c27a37b0bc8d721ca7a6b9458,
      0x1c13a28a747e7814fa1c37fd9cfd4a19a31bba98ee94800205ecdb5e431ee6a0,
      0x241e66706aabfffe157915e4e26ebeffb3f544120d58acfe1e362933d4dd31db
    ]
  ];

  uint256[8][3] revealProofUints = [
    [
      0x0987225cb0d8c55e34235f3f7d7a3c10a93bae37874e33acc0157bcac97938d8,
      0x1064e8cfddf390daea7362e3bb4f695300338b06075924c0322522950af41ea8,
      0x1e68a6a7df8178b357316496e045cab1700d4eb2cb1de017acefa34f0f20cddf,
      0x20b7c5c2dd01b24629c71d74968573fad0ab829cdebed4247a78b35008ef5b60,
      0x0cae27f980adb0f1cd56569bcf0a51485b5cf4a1d4867b6a0b036d5444973c85,
      0x04315ecfcdb070ec81f8ee21644cc71a5ae1774ee35d9374446b1bda40c63e99,
      0x17de7eddb3b63ef9f02afeedc7cf665b6fe2eb8a66a4a89940cee131ee62f98d,
      0x2e7a8455455f8482b0174b871d539e690e7f4740bfe213fd196149ed0904be74
    ],
    [
      0x24e32fb7254fdd4a7d599a13463fc9f3ce1ccb5e321f419ad580d91f8ca07543,
      0x1ae3137d99fafffaec3af3d233a6bb31c22313d6a69d706afbd3b66fb0fb62ca,
      0x299a882182e3f31eea7ec7ec3ddeff3b961a5bc8ee6ded10af76eead34719477,
      0x1b7c1a0b0aef40d886f94578b444e115b8feffc5a887d3dbaef46c559f0ff036,
      0x205445998cd549a65f368fe291cdeb559d27db80de74abd1d3a206150ef41630,
      0x117648f09f767985b5998d4bfe0c7248e67b6517130a8127387ef89300371f8c,
      0x1fc64838fba3a2b32baa0ec3595b2594f98b8f911a924def9a96cc04675c1b01,
      0x1d55dd756c6f28c4faa5bf1745f398ba8b1fd50bc10619567f28036355585ab8
    ],
    [
      0x024a1b5d028d8b3d727a8d0626a4d222cea680cbe96432a32e67de399f9c0e75,
      0x29273bfae966295c71682a35a965edbf30bf56dcc4e534cc7458f0d375205311,
      0x2b6d16c2662f4a4eba149aae53720ae08ad791731e6f40ee7f46fcd3b1d716f8,
      0x1071a8cbe9e50df8093251f13d58aca4f4691632cd9085df076beeb6b07c19a5,
      0x1cffb1f8af3c3077a612d6fd84f0e115d47bbfb04ae8a7d0bce5aef21a3281b3,
      0x0808f29b02d780fb94a5aad7b173e9632baacab01b579c9178ed2e2f09e014e2,
      0x0b33850b87d041f477392d9c63c9694e21c7a22e28489c80ff5df354aa035d51,
      0x0cf6b3e35c724cd9fd51d5b80194ea942868be2513aa3b88692154afbb2e34c4
    ]
  ];

  uint256[3] moveAttestations = [
    0x131e4d5462c64621113cdd27344ba7d6e44c69df619f8b5bcb3bafa5dcad80a3,
    0x03a2ab5cebb2b82a7a52f9c15b47c39445b081d55b5c2dd7704b4ca61884d125,
    0x1fb12b3564d6c736426e1886274d8091949949380d01997db78f2252df559ad5
  ];

  function getErrorBytes(bytes memory error) public pure returns (bytes memory) {
    return abi.encodePacked(bytes4(keccak256(error)));
  }

  function generatePermitHash(
    address owner,
    address spender,
    uint256 value,
    uint256 nonce,
    uint256 deadline
  ) public view returns (bytes32) {
    return
      keccak256(
        abi.encodePacked(
          "\x19\x01",
          erc20.DOMAIN_SEPARATOR(),
          keccak256(
            abi.encode(
              keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
              owner,
              spender,
              value,
              nonce,
              deadline
            )
          )
        )
      );
  }

  function testStartRound() public {
    uint256[8] memory proof = moveProofUints[0];
    uint256 arbibotId = 0;

    uint256 nonceBefore = rps.getNonce(arbibotId);
    uint256 roundBefore = rps.totalRounds();
    uint64 bt = uint64(block.timestamp);

    rps.startRound(ArbibotRPS.StartParams(proof, arbibotId, moveAttestations[0], 0xb07dad, 0, 0, 0, 0, "", ""));

    ArbibotRPS.Round memory round = rps.getRound(roundBefore);
    assertEq(round.arbibotId1, arbibotId);
    assertEq(round.arbibotId2, 0);
    assertEq(round.winner, 0);
    assertEq(round.startedAt, bt);
    assertEq(round.move1Attestation, moveAttestations[0]);
    assertEq(round.nonce, 0xb07dad);
    assertEq(round.move1, rps.DEAD_MOVE());
    assertEq(round.move2, rps.DEAD_MOVE());
    assertTrue(!round.ended);

    uint256 nonceAfter = rps.getNonce(arbibotId);
    uint256 roundAfter = rps.totalRounds();
    assertEq(roundBefore + 1, roundAfter);
    assertEq(nonceBefore + 1, nonceAfter);
  }

  function testSubmitMove2() public {
    uint256[8] memory proof = moveProofUints[0];
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move = 1;

    uint256 roundId = rps.totalRounds();
    rps.startRound(ArbibotRPS.StartParams(proof, arbibotId1, moveAttestations[0], 0, 0, 0, 0, 0, "", ""));
    rps.submitMove2(ArbibotRPS.Move2Params(arbibotId2, roundId, move, 0, 0, "", ""));

    ArbibotRPS.Round memory round = rps.getRound(roundId);
    assertEq(round.arbibotId2, arbibotId2);
    assertEq(round.winner, 0);
    assertEq(round.move1, rps.DEAD_MOVE());
    assertEq(round.move2, move);
    assertTrue(!round.ended);
  }

  function testEndRound() public {
    uint256[8] memory startProof = moveProofUints[0];
    uint256[8] memory revealProof = revealProofUints[0];
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move = 1;

    uint256 roundId = rps.totalRounds();
    rps.startRound(ArbibotRPS.StartParams(startProof, arbibotId1, moveAttestations[0], 0, 0, 0, 0, 0, "", ""));
    rps.submitMove2(ArbibotRPS.Move2Params(arbibotId2, roundId, move, 0, 0, "", ""));
    rps.endRound(ArbibotRPS.EndParams(revealProof, arbibotId1, roundId, 0, moveAttestations[0]));

    uint64 bt = uint64(block.timestamp);

    ArbibotRPS.Round memory round = rps.getRound(roundId);
    assertEq(round.arbibotId1, arbibotId1);
    assertEq(round.arbibotId2, arbibotId2);
    assertEq(round.move2PlayedAt, bt);
    assertEq(round.winner, 2);
    assertEq(round.move1Attestation, moveAttestations[0]);
    assertEq(round.move1, 0);
    assertEq(round.move2, 1);
    assertTrue(round.ended);
  }

  function testAllWinnerCombos() public {
    for (uint8 i = 0; i < 3; i++) {
      for (uint8 j = 0; j < 3; j++) {
        uint256[8] memory startProof = moveProofUints[i];
        uint256[8] memory revealProof = revealProofUints[i];
        uint256 arbibotId1 = 0;
        uint256 arbibotId2 = 1;

        uint256 roundId = rps.totalRounds();
        rps.startRound(ArbibotRPS.StartParams(startProof, arbibotId1, moveAttestations[i], 0, 0, 0, 0, 0, "", ""));
        rps.submitMove2(ArbibotRPS.Move2Params(arbibotId2, roundId, j, 0, 0, "", ""));
        rps.endRound(ArbibotRPS.EndParams(revealProof, arbibotId1, roundId, i, moveAttestations[i]));

        ArbibotRPS.Round memory round = rps.getRound(roundId);
        if (i == j) {
          assertEq(round.winner, 0);
        }

        if (i == 0 && j == 1) {
          // rock vs paper, paper wins
          assertEq(round.winner, 2);
        }

        if (i == 0 && j == 2) {
          // rock vs scissor, rock wins
          assertEq(round.winner, 1);
        }

        if (i == 1 && j == 0) {
          // paper vs rock, paper wins
          assertEq(round.winner, 1);
        }

        if (i == 1 && j == 2) {
          // paper vs scissors, scissors wins
          assertEq(round.winner, 2);
        }

        if (i == 2 && j == 0) {
          // scissors vs rock, rock wins
          assertEq(round.winner, 2);
        }

        if (i == 2 && j == 1) {
          // scissors vs paper, scissors wins
          assertEq(round.winner, 1);
        }
      }
    }
  }

  function testSubmitMoveInvalid() public {
    uint256[8] memory startProof = moveProofUints[0];
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move = 3;

    uint256 roundId = rps.totalRounds();
    rps.startRound(ArbibotRPS.StartParams(startProof, arbibotId1, moveAttestations[0], 0, 0, 0, 0, 0, "", ""));

    vm.expectRevert(getErrorBytes("ErrorInvalidMove()"));
    rps.submitMove2(ArbibotRPS.Move2Params(arbibotId2, roundId, move, 0, 0, "", ""));
  }

  function testSubmitMove2Twice() public {
    uint256[8] memory startProof = moveProofUints[0];
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move1 = 1;
    uint8 move2 = 1;

    uint256 roundId = rps.totalRounds();
    rps.startRound(ArbibotRPS.StartParams(startProof, arbibotId1, moveAttestations[0], 0, 0, 0, 0, 0, "", ""));
    rps.submitMove2(ArbibotRPS.Move2Params(arbibotId2, roundId, move1, 0, 0, "", ""));

    vm.expectRevert(getErrorBytes("ErrorRoundHasMove()"));
    rps.submitMove2(ArbibotRPS.Move2Params(arbibotId2, roundId, move2, 0, 0, "", ""));
  }

  function testEndRoundMismatchedAttestation() public {
    uint256[8] memory startProof = moveProofUints[0];
    uint256[8] memory revealProof = revealProofUints[1];
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move = 1;

    uint256 roundId = rps.totalRounds();
    rps.startRound(ArbibotRPS.StartParams(startProof, arbibotId1, moveAttestations[0], 0, 0, 0, 0, 0, "", ""));
    rps.submitMove2(ArbibotRPS.Move2Params(arbibotId2, roundId, move, 0, 0, "", ""));
    vm.expectRevert(getErrorBytes("ErrorUnauthorized()"));
    rps.endRound(ArbibotRPS.EndParams(revealProof, arbibotId1, roundId, 1, moveAttestations[1]));
  }

  function testExpiredBeforeRound2() public {
    uint256[8] memory startProof = moveProofUints[0];
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move2 = 1;

    uint256 roundId = rps.totalRounds();

    rps.startRound(ArbibotRPS.StartParams(startProof, arbibotId1, moveAttestations[0], 0, 1, 0, 0, 0, "", ""));

    vm.warp(block.timestamp + 2);

    vm.expectRevert(getErrorBytes("ErrorDeadlineExpired()"));
    rps.submitMove2(ArbibotRPS.Move2Params(arbibotId2, roundId, move2, 0, 0, "", ""));
  }

  function testExpiredBeforeEnd() public {
    uint256[8] memory startProof = moveProofUints[0];
    uint256[8] memory revealProof = revealProofUints[0];
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move1 = 0;
    uint8 move2 = 1;

    uint256 roundId = rps.totalRounds();
    rps.startRound(ArbibotRPS.StartParams(startProof, arbibotId1, moveAttestations[0], 0, 2, 0, 0, 0, "", ""));
    vm.warp(block.timestamp + 1);
    rps.submitMove2(ArbibotRPS.Move2Params(arbibotId2, roundId, move2, 0, 0, "", ""));

    vm.warp(block.timestamp + 3);
    vm.expectRevert(getErrorBytes("ErrorDeadlineExpired()"));
    rps.endRound(ArbibotRPS.EndParams(revealProof, arbibotId1, roundId, move1, moveAttestations[0]));
  }

  function testWagerPayout() public {
    uint256 amount = 1;
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 1;
    uint8 move1 = 0;
    uint8 move2 = 1;
    uint256 roundId = rps.totalRounds();

    assertEq(erc20.balanceOf(someAddress), 0);
    assertEq(erc20.balanceOf(otherAddress), 0);

    erc20.mint(someAddress, amount);
    erc20.mint(otherAddress, amount);

    assertEq(erc20.balanceOf(someAddress), 1);
    assertEq(erc20.balanceOf(otherAddress), 1);

    ArbibotRPS.StartParams memory startParams;
    {
      uint256 nonce = erc20.nonces(someAddress);
      uint256 deadline = block.timestamp + 2;
      bytes32 hash = generatePermitHash(someAddress, address(rps), amount, nonce, deadline);

      (uint8 v, bytes32 r, bytes32 s) = vm.sign(somePrivateKey, hash);
      startParams = ArbibotRPS.StartParams(
        moveProofUints[0],
        arbibotId1,
        moveAttestations[0],
        0,
        0,
        amount,
        deadline,
        v,
        r,
        s
      );
    }

    erc721.setOwner(someAddress);
    vm.prank(someAddress);
    rps.startRound(startParams);

    assertEq(erc20.balanceOf(someAddress), 0);

    ArbibotRPS.Move2Params memory move2Params;
    {
      uint256 nonce = erc20.nonces(otherAddress);
      uint256 deadline = block.timestamp + 2;
      bytes32 hash = generatePermitHash(otherAddress, address(rps), amount, nonce, deadline);

      (uint8 v, bytes32 r, bytes32 s) = vm.sign(otherPrivateKey, hash);
      move2Params = ArbibotRPS.Move2Params(arbibotId2, roundId, move2, deadline, v, r, s);
    }

    erc721.setOwner(otherAddress);
    vm.prank(otherAddress);
    rps.submitMove2(move2Params);

    assertEq(erc20.balanceOf(otherAddress), 0);

    vm.prank(otherAddress);
    rps.endRound(ArbibotRPS.EndParams(revealProofUints[0], arbibotId1, roundId, move1, moveAttestations[0]));

    assertEq(erc20.balanceOf(someAddress), 0);
    assertEq(erc20.balanceOf(otherAddress), 2);
  }

  function testWagerPayoutOnTie() public {
    uint256 amount = 1;
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 2;
    uint8 move1 = 0;
    uint8 move2 = 0;
    uint256 roundId = rps.totalRounds();

    assertEq(erc20.balanceOf(someAddress), 0);
    assertEq(erc20.balanceOf(otherAddress), 0);

    erc20.mint(someAddress, amount);
    erc20.mint(otherAddress, amount);

    assertEq(erc20.balanceOf(someAddress), 1);
    assertEq(erc20.balanceOf(otherAddress), 1);

    ArbibotRPS.StartParams memory startParams;
    {
      uint256 nonce = erc20.nonces(someAddress);
      uint256 deadline = block.timestamp + 2;
      bytes32 hash = generatePermitHash(someAddress, address(rps), amount, nonce, deadline);

      (uint8 v, bytes32 r, bytes32 s) = vm.sign(somePrivateKey, hash);
      startParams = ArbibotRPS.StartParams(
        moveProofUints[0],
        arbibotId1,
        moveAttestations[0],
        0,
        0,
        amount,
        deadline,
        v,
        r,
        s
      );
    }

    erc721.setOwner(someAddress);
    vm.prank(someAddress);
    rps.startRound(startParams);

    assertEq(erc20.balanceOf(someAddress), 0);

    ArbibotRPS.Move2Params memory move2Params;
    {
      uint256 nonce = erc20.nonces(otherAddress);
      uint256 deadline = block.timestamp + 2;
      bytes32 hash = generatePermitHash(otherAddress, address(rps), amount, nonce, deadline);

      (uint8 v, bytes32 r, bytes32 s) = vm.sign(otherPrivateKey, hash);
      move2Params = ArbibotRPS.Move2Params(arbibotId2, roundId, move2, deadline, v, r, s);
    }

    erc721.setOwner2(otherAddress);
    vm.prank(otherAddress);
    rps.submitMove2(move2Params);

    assertEq(erc20.balanceOf(otherAddress), 0);

    vm.prank(someAddress);
    rps.endRound(ArbibotRPS.EndParams(revealProofUints[0], arbibotId1, roundId, move1, moveAttestations[0]));

    assertEq(erc20.balanceOf(someAddress), 1);
    assertEq(erc20.balanceOf(otherAddress), 1);
  }

  function testRefund() public {
    uint256 amount = 1;
    uint256 arbibotId1 = 0;
    uint256 roundId = rps.totalRounds();

    assertEq(erc20.balanceOf(someAddress), 0);
    assertEq(erc20.balanceOf(otherAddress), 0);

    erc20.mint(someAddress, amount);
    erc20.mint(otherAddress, amount);

    assertEq(erc20.balanceOf(someAddress), 1);
    assertEq(erc20.balanceOf(otherAddress), 1);

    ArbibotRPS.StartParams memory startParams;
    {
      uint256 nonce = erc20.nonces(someAddress);
      uint256 deadline = block.timestamp + 2;
      bytes32 hash = generatePermitHash(someAddress, address(rps), amount, nonce, deadline);

      (uint8 v, bytes32 r, bytes32 s) = vm.sign(somePrivateKey, hash);
      startParams = ArbibotRPS.StartParams(
        moveProofUints[0],
        arbibotId1,
        moveAttestations[0],
        0,
        2,
        amount,
        deadline,
        v,
        r,
        s
      );
    }

    erc721.setOwner(someAddress);
    vm.prank(someAddress);
    rps.startRound(startParams);

    assertEq(erc20.balanceOf(someAddress), 0);

    vm.warp(block.timestamp + 3);

    vm.prank(someAddress);
    rps.getRefund(arbibotId1, roundId);

    assertEq(erc20.balanceOf(someAddress), 1);
  }

  function testCollectForfeit() public {
    uint256 amount = 1;
    uint256 arbibotId1 = 0;
    uint256 arbibotId2 = 2;
    uint8 move2 = 0;
    uint256 roundId = rps.totalRounds();

    assertEq(erc20.balanceOf(someAddress), 0);
    assertEq(erc20.balanceOf(otherAddress), 0);

    erc20.mint(someAddress, amount);
    erc20.mint(otherAddress, amount);

    assertEq(erc20.balanceOf(someAddress), 1);
    assertEq(erc20.balanceOf(otherAddress), 1);

    ArbibotRPS.StartParams memory startParams;
    {
      uint256 nonce = erc20.nonces(someAddress);
      uint256 deadline = block.timestamp + 2;
      bytes32 hash = generatePermitHash(someAddress, address(rps), amount, nonce, deadline);

      (uint8 v, bytes32 r, bytes32 s) = vm.sign(somePrivateKey, hash);
      startParams = ArbibotRPS.StartParams(
        moveProofUints[0],
        arbibotId1,
        moveAttestations[0],
        0,
        2,
        amount,
        deadline,
        v,
        r,
        s
      );
    }

    erc721.setOwner(someAddress);
    vm.prank(someAddress);
    rps.startRound(startParams);

    assertEq(erc20.balanceOf(someAddress), 0);

    ArbibotRPS.Move2Params memory move2Params;
    {
      uint256 nonce = erc20.nonces(otherAddress);
      uint256 deadline = block.timestamp + 2;
      bytes32 hash = generatePermitHash(otherAddress, address(rps), amount, nonce, deadline);

      (uint8 v, bytes32 r, bytes32 s) = vm.sign(otherPrivateKey, hash);
      move2Params = ArbibotRPS.Move2Params(arbibotId2, roundId, move2, deadline, v, r, s);
    }

    erc721.setOwner2(otherAddress);
    vm.prank(otherAddress);
    rps.submitMove2(move2Params);

    assertEq(erc20.balanceOf(otherAddress), 0);

    vm.warp(block.timestamp + 3);

    vm.prank(otherAddress);
    rps.collectForfeit(arbibotId2, roundId);

    assertEq(erc20.balanceOf(otherAddress), 2);
  }

  function testNotOwner() public {
    erc721.setOwner(address(0));

    vm.expectRevert(getErrorBytes("ErrorUnauthorized()"));
    rps.startRound(ArbibotRPS.StartParams([uint256(0), 0, 0, 0, 0, 0, 0, 0], 0, 0, 0, 0, 0, 0, 0, "", ""));
  }
}
