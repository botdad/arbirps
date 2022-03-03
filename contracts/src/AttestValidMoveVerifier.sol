// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// 2019 OKIMS
//      ported to solidity 0.6
//      fixed linter warnings
//      added requiere error messages
//
//
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Pairing.sol";

library AttestValidMoveVerifier {
  function verifyingKey() internal pure returns (Pairing.VerifyingKey memory vk) {
    vk.alfa1 = Pairing.G1Point(
      20491192805390485299153009773594534940189261866228447918068658471970481763042,
      9383485363053290200918347156157836566562967994039712273449902621266178545958
    );

    vk.beta2 = Pairing.G2Point(
      [
        4252822878758300859123897981450591353533073413197771768651442665752259397132,
        6375614351688725206403948262868962793625744043794305715222011528459656738731
      ],
      [
        21847035105528745403288232691147584728191162732299865338377159692350059136679,
        10505242626370262277552901082094356697409835680220590971873171140371331206856
      ]
    );
    vk.gamma2 = Pairing.G2Point(
      [
        11559732032986387107991004021392285783925812861821192530917403151452391805634,
        10857046999023057135944570762232829481370756359578518086990519993285655852781
      ],
      [
        4082367875863433681332203403145435568316851327593401208105741076214120093531,
        8495653923123431417604973247489272438418190587263600148770280649306958101930
      ]
    );
    vk.delta2 = Pairing.G2Point(
      [
        1976896772394208207206348884886237197682849526114950566744767408117958977650,
        7152494708469248519761274383768110379856530975361011929052524581967642656825
      ],
      [
        19426101668101186756250167899763898445154179333066533925548483347043271746091,
        5820868087066030481156966333262412032794456902363990640099373064242262293153
      ]
    );
    vk.IC = new Pairing.G1Point[](2);

    vk.IC[0] = Pairing.G1Point(
      5702784008672211341191310807134600429867924385972480057796665705135389846467,
      16593561665839258714411145167988636433990773012843912303800426587921522246141
    );

    vk.IC[1] = Pairing.G1Point(
      2210728128548931084755365790469008816254755455732856556163270225835525712828,
      12075144457950567660082534478513264965749269640899923531312786977330151877455
    );
  }

  function verifyProof(bytes memory proof, uint256[1] memory input) internal view returns (bool) {
    uint256[8] memory p = abi.decode(proof, (uint256[8]));

    // Make sure that each element in the proof is less than the prime q
    for (uint8 i = 0; i < p.length; i++) {
      require(p[i] < Pairing.PRIME_Q, "verifier-proof-element-gte-prime-q");
    }

    Pairing.G1Point memory proofA = Pairing.G1Point(p[0], p[1]);
    Pairing.G2Point memory proofB = Pairing.G2Point([p[2], p[3]], [p[4], p[5]]);
    Pairing.G1Point memory proofC = Pairing.G1Point(p[6], p[7]);

    Pairing.VerifyingKey memory vk = verifyingKey();

    // Compute the linear combination vk_x
    Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
    vk_x = Pairing.plus(vk_x, vk.IC[0]);

    // Make sure that every input is less than the snark scalar field
    for (uint256 i = 0; i < input.length; i++) {
      require(input[i] < Pairing.SNARK_SCALAR_FIELD, "verifier-gte-snark-scalar-field");
      vk_x = Pairing.plus(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
    }

    return Pairing.pairing(Pairing.negate(proofA), proofB, vk.alfa1, vk.beta2, vk_x, vk.gamma2, proofC, vk.delta2);
  }
}
