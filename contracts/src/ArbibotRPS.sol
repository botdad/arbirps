// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./AttestValidMoveVerifier.sol";
import "./RevealMoveVerifier.sol";
import "./IMinimalERC721.sol";

/// @title ArbibotRPS
/// @author botdad
/// @notice On chain rock paper scissors game for Arbibot holders using zkp
contract ArbibotRPS {
  /// -----------------------------------------------------------------------
  /// Errors
  /// -----------------------------------------------------------------------
  error ErrorInvalidProof();
  error ErrorInvalidMove();
  error ErrorRoundHasMove();
  error ErrorUnauthorized();
  error ErrorNoMove2();
  error ErrorDeadlineExpired();

  /// -----------------------------------------------------------------------
  /// Custom types
  /// -----------------------------------------------------------------------
  struct Round {
    uint256 arbibotId1;
    uint256 arbibotId2;
    uint256 move1Attestation;
    // all of the following can fit together in a 256 bit word
    uint32 nonce;
    uint64 maxRoundTime;
    uint64 startedAt;
    uint64 move2PlayedAt;
    uint8 move1;
    uint8 move2;
    uint8 winner;
    bool ended;
  }

  /// -----------------------------------------------------------------------
  /// Immutable parameters
  /// -----------------------------------------------------------------------
  uint8 public immutable DEAD_MOVE = 3;
  IMinimalERC721 public immutable arbibots;

  /// -----------------------------------------------------------------------
  /// Storage variables
  /// -----------------------------------------------------------------------
  uint256 public totalRounds;
  Round[] public rounds;

  constructor(address _arbibots) {
    arbibots = IMinimalERC721(_arbibots);
  }

  modifier onlyArbibotOwner(uint256 arbibotId) {
    if (arbibots.ownerOf(arbibotId) != msg.sender) {
      revert ErrorUnauthorized();
    }
    _;
  }

  /// -----------------------------------------------------------------------
  /// User actions
  /// -----------------------------------------------------------------------

  /// @notice Starts a new round and opens up play
  /// @dev Requires a valid AttestValidMove zk proof created off chain
  /// @param proof ZK Proof
  /// @param arbibotId id of the owned arbibot to use
  /// @param moveAttestation The input signal that will be stored on chain
  /// and compared to when move is revealed
  function startRound(
    uint256[8] calldata proof,
    uint256 arbibotId,
    uint256 moveAttestation,
    uint256 nonce,
    uint256 maxRoundTime
  ) external onlyArbibotOwner(arbibotId) {
    /// -------------------------------------------------------------------
    /// Validation
    /// -------------------------------------------------------------------
    if (!AttestValidMoveVerifier.verifyProof(proof, moveAttestation)) {
      revert ErrorInvalidProof();
    }

    /// -------------------------------------------------------------------
    /// State updates
    /// -------------------------------------------------------------------
    Round memory round = Round(
      arbibotId,
      0, // no arbibot2 id yet
      moveAttestation,
      uint32(nonce),
      uint64(maxRoundTime),
      uint64(block.timestamp),
      0, // move 2 not played yet
      DEAD_MOVE,
      DEAD_MOVE,
      0, // winner is tie until end
      false
    );
    rounds.push(round);
    unchecked {
      ++totalRounds;
    }
  }

  /// @notice Starts a new round and opens up play
  /// @dev Requires a valid AttestValidMove zk proof created off chain
  /// @param arbibotId id of the owned arbibot to use
  /// @param roundId roundId used in startRound
  /// @param move RPS move
  function submitMove2(
    uint256 arbibotId,
    uint256 roundId,
    uint8 move
  ) external onlyArbibotOwner(arbibotId) {
    /// -------------------------------------------------------------------
    /// Validation
    /// -------------------------------------------------------------------
    Round memory round = rounds[roundId];

    if (round.ended || round.move2 != DEAD_MOVE) {
      revert ErrorRoundHasMove();
    }

    if (move > 2) {
      revert ErrorInvalidMove();
    }

    uint64 blockTimestamp = uint64(block.timestamp);
    if (blockTimestamp != 0 && blockTimestamp > round.maxRoundTime + round.startedAt) {
      revert ErrorDeadlineExpired();
    }

    /// -------------------------------------------------------------------
    /// State updates
    /// -------------------------------------------------------------------
    round.arbibotId2 = arbibotId;
    round.move2 = move;
    round.move2PlayedAt = blockTimestamp;

    rounds[roundId] = round;
  }

  /// @notice Starts a new round and opens up play
  /// @dev Requires a valid RevealMove zk proof created off chain
  /// @param proof ZK Proof
  /// @param arbibotId id of the owned arbibot to use
  /// @param roundId roundId used in startRound
  /// @param move1 move used in startRound to be revealed
  /// @param move1Attestation Attestation used in startRound
  function endRound(
    uint256[8] calldata proof,
    uint256 arbibotId,
    uint256 roundId,
    uint8 move1,
    uint256 move1Attestation
  ) external onlyArbibotOwner(arbibotId) {
    /// -------------------------------------------------------------------
    /// Validation
    /// -------------------------------------------------------------------
    Round memory round = rounds[roundId];

    if (round.arbibotId1 != arbibotId) {
      revert ErrorUnauthorized();
    }

    if (round.move1Attestation != move1Attestation) {
      revert ErrorUnauthorized();
    }

    if (round.ended || round.move1 != DEAD_MOVE) {
      revert ErrorRoundHasMove();
    }

    if (round.move2 == DEAD_MOVE) {
      revert ErrorNoMove2();
    }

    if (move1 == DEAD_MOVE) {
      revert ErrorInvalidMove();
    }

    uint64 blockTimestamp = uint64(block.timestamp);
    if (blockTimestamp != 0 && blockTimestamp > round.maxRoundTime + round.move2PlayedAt) {
      revert ErrorDeadlineExpired();
    }

    if (!RevealMoveVerifier.verifyProof(proof, move1, move1Attestation)) {
      revert ErrorInvalidProof();
    }

    /// -------------------------------------------------------------------
    /// State updates
    /// -------------------------------------------------------------------
    round.move1 = move1;
    round.ended = true;

    if (round.move1 > round.move2) {
      unchecked {
        uint8 diff = round.move1 - round.move2;
        round.winner = diff == 1 ? 1 : 2;
      }
    } else if (round.move1 < round.move2) {
      unchecked {
        uint8 diff = round.move2 - round.move1;
        round.winner = diff == 1 ? 2 : 1;
      }
    } // else tie, no winner

    rounds[roundId] = round;
  }

  /// -------------------------------------------------------------------
  /// Views
  /// -------------------------------------------------------------------

  /// @notice Gets single round of play
  /// @param roundId id of the round
  /// @return round
  function getRound(uint256 roundId) external view returns (Round memory) {
    return rounds[roundId];
  }

  /// @notice Gets all rounds of play
  /// @return rounds all rounds
  function getRounds() external view returns (Round[] memory) {
    return rounds;
  }

  /// @notice Gets per arbibot nonce for signature generation
  /// @param arbibotId id of the arbibot
  /// @return nonce nonce to use for signature generation
  function getNonce(uint256 arbibotId) external view returns (uint256 nonce) {
    for (uint256 i = 0; i < rounds.length; i++) {
      Round memory round = rounds[i];
      if (round.arbibotId1 == arbibotId) {
        nonce++;
      }
    }
  }
}
