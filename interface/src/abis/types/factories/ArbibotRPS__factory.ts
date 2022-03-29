/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ArbibotRPS, ArbibotRPSInterface } from "../ArbibotRPS";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_arbibots",
        type: "address",
      },
      {
        internalType: "address",
        name: "_botgold",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ErrorInvalidMaxRoundTime",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrorInvalidMove",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrorInvalidProof",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrorNoMove2",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrorRoundHasMove",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrorUnauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "arbibotId2",
        type: "uint256",
      },
    ],
    name: "Move2Played",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "winner",
        type: "uint256",
      },
    ],
    name: "RoundEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "arbibotId1",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wager",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "maxRoundTime",
        type: "uint64",
      },
    ],
    name: "RoundStarted",
    type: "event",
  },
  {
    inputs: [],
    name: "DEAD_MOVE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "arbibots",
    outputs: [
      {
        internalType: "contract IMinimalERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "botgold",
    outputs: [
      {
        internalType: "contract IMinimalERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "arbibotId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "collectForfeit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256[8]",
            name: "proof",
            type: "uint256[8]",
          },
          {
            internalType: "uint256",
            name: "arbibotId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "move1",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "move1Attestation",
            type: "uint256",
          },
        ],
        internalType: "struct ArbibotRPS.EndParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "endRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "arbibotId",
        type: "uint256",
      },
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "getRound",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "arbibotId1",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "arbibotId2",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "move1Attestation",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "wager",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "nonce",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "maxRoundTime",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "startedAt",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "move2PlayedAt",
            type: "uint64",
          },
          {
            internalType: "uint8",
            name: "move1",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "move2",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "winner",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "ended",
            type: "bool",
          },
        ],
        internalType: "struct ArbibotRPS.Round",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRounds",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "arbibotId1",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "arbibotId2",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "move1Attestation",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "wager",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "nonce",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "maxRoundTime",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "startedAt",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "move2PlayedAt",
            type: "uint64",
          },
          {
            internalType: "uint8",
            name: "move1",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "move2",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "winner",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "ended",
            type: "bool",
          },
        ],
        internalType: "struct ArbibotRPS.Round[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rounds",
    outputs: [
      {
        internalType: "uint256",
        name: "arbibotId1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "arbibotId2",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "move1Attestation",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "wager",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "nonce",
        type: "uint32",
      },
      {
        internalType: "uint64",
        name: "maxRoundTime",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "startedAt",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "move2PlayedAt",
        type: "uint64",
      },
      {
        internalType: "uint8",
        name: "move1",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "move2",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "winner",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "ended",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256[8]",
            name: "proof",
            type: "uint256[8]",
          },
          {
            internalType: "uint256",
            name: "arbibotId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "moveAttestation",
            type: "uint256",
          },
          {
            internalType: "uint32",
            name: "nonce",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "maxRoundTime",
            type: "uint64",
          },
          {
            internalType: "uint256",
            name: "permitAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "permitDeadline",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "permitV",
            type: "uint8",
          },
          {
            internalType: "bytes32",
            name: "permitR",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "permitS",
            type: "bytes32",
          },
        ],
        internalType: "struct ArbibotRPS.StartParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "startRound",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "arbibotId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "move",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "permitDeadline",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "permitV",
            type: "uint8",
          },
          {
            internalType: "bytes32",
            name: "permitR",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "permitS",
            type: "bytes32",
          },
        ],
        internalType: "struct ArbibotRPS.Move2Params",
        name: "params",
        type: "tuple",
      },
    ],
    name: "submitMove2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRounds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class ArbibotRPS__factory {
  static readonly abi = _abi;
  static createInterface(): ArbibotRPSInterface {
    return new utils.Interface(_abi) as ArbibotRPSInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArbibotRPS {
    return new Contract(address, _abi, signerOrProvider) as ArbibotRPS;
  }
}
