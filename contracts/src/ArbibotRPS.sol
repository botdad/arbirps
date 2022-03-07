// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./AttestValidMoveVerifier.sol";
import "./RevealMoveVerifier.sol";
import "./IMinimalERC721.sol";

contract ArbibotRPS {
  error ErrorInvalidProof();
  error ErrorInvalidMove();
  error ErrorRoundHasMove();
  error ErrorUnauthorized();
  error ErrorNoMove2();

  uint8 public immutable DEAD_MOVE = 3;
  IMinimalERC721 public immutable arbibots;

  struct Round {
    uint256 arbibotId1;
    uint256 arbibotId2;
    uint256 winner;
    uint256 move1Attestation;
    uint8 move1;
    uint8 move2;
    bool ended;
  }

  uint256 public totalRounds;
  mapping(uint256 => Round) public rounds;
  mapping(uint256 => uint256) public nonces;

  constructor(address _arbibots) {
    arbibots = IMinimalERC721(_arbibots);
  }

  modifier onlyArbibotOwner(uint256 arbibotId) {
    if (arbibots.ownerOf(arbibotId) != msg.sender) {
      revert ErrorUnauthorized();
    }
    _;
  }

  function startRound(
    uint256 arbibotId,
    bytes memory proof,
    uint256 input
  ) external onlyArbibotOwner(arbibotId) {
    if (!AttestValidMoveVerifier.verifyProof(proof, input)) {
      revert ErrorInvalidProof();
    }

    unchecked {
      nonces[arbibotId] += 1;
    }

    Round memory round = Round(arbibotId, 0, 0, input, DEAD_MOVE, DEAD_MOVE, false);
    rounds[totalRounds] = round;
    totalRounds++;
  }

  function submitMove2(
    uint256 arbibotId,
    uint256 roundId,
    uint8 move
  ) external onlyArbibotOwner(arbibotId) {
    Round memory round = rounds[roundId];

    if (round.ended || round.move2 != DEAD_MOVE) {
      revert ErrorRoundHasMove();
    }

    if (move > 2) {
      revert ErrorInvalidMove();
    }

    round.arbibotId2 = arbibotId;
    round.move2 = move;

    rounds[roundId] = round;
  }

  function endRound(
    uint256 arbibotId,
    uint256 roundId,
    bytes memory proof,
    uint256[4] memory input
  ) external onlyArbibotOwner(arbibotId) {
    Round memory round = rounds[roundId];

    if (round.arbibotId1 != arbibotId) {
      revert ErrorUnauthorized();
    }

    if (round.move1Attestation != input[3]) {
      revert ErrorUnauthorized();
    }

    if (round.ended || round.move1 != DEAD_MOVE) {
      revert ErrorRoundHasMove();
    }

    if (round.move2 == DEAD_MOVE) {
      revert ErrorNoMove2();
    }

    uint8 move = DEAD_MOVE;
    if (input[0] == 1) {
      move = 0;
    } else if (input[1] == 1) {
      move = 1;
    } else if (input[2] == 1) {
      move = 2;
    }

    if (move == DEAD_MOVE) {
      revert ErrorInvalidMove();
    }

    if (!RevealMoveVerifier.verifyProof(proof, input)) {
      revert ErrorInvalidProof();
    }

    round.move1 = move;
    round.ended = true;

    if (round.move1 > round.move2) {
      unchecked {
        uint8 diff = round.move1 - round.move2;
        round.winner = diff == 1 ? round.arbibotId1 : round.arbibotId2;
      }
    } else if (round.move1 < round.move2) {
      unchecked {
        uint8 diff = round.move2 - round.move1;
        round.winner = diff == 1 ? round.arbibotId2 : round.arbibotId1;
      }
    } // else tie, no winner

    rounds[roundId] = round;
  }
}
