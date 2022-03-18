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

library RevealMoveVerifier {
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
        15820304844160512581121687715646530746723978400709193611488405510051598346768,
        1305933348488613881442548321912483940404100804652995934981908136086733892603
      ],
      [
        14088265232486717230561089095107500563156768775152330016394664882448567937049,
        6021778849855767497013275000658504538769753625567955011282905932506029050476
      ]
    );
    vk.IC = new Pairing.G1Point[](3);

    vk.IC[0] = Pairing.G1Point(
      17695721835980952883572957893070711886498670598840523534723892329400002980660,
      1375538267676284256365804057784599576059462190471132403453937084769163699201
    );

    vk.IC[1] = Pairing.G1Point(
      5104164394772248812874000595033838039640630080120470217070553095102378195959,
      9779349142792042798929828883084968576549878362896718734686385587484282713548
    );

    vk.IC[2] = Pairing.G1Point(
      15490655774578298600817746499412653061309386697314717434598105283122412555654,
      15816785024391849763743633031635394123638112343603082659648465685687236644445
    );
  }

  function verifyProof(
    uint256[8] memory p,
    uint256 move,
    uint256 moveAttestation
  ) internal view returns (bool) {
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

    uint256[2] memory proofInput = [move, moveAttestation];
    // Make sure that every input is less than the snark scalar field
    for (uint256 i = 0; i < proofInput.length; i++) {
      require(proofInput[i] < Pairing.SNARK_SCALAR_FIELD, "verifier-gte-snark-scalar-field");
      vk_x = Pairing.plus(vk_x, Pairing.scalar_mul(vk.IC[i + 1], proofInput[i]));
    }

    return Pairing.pairing(Pairing.negate(proofA), proofB, vk.alfa1, vk.beta2, vk_x, vk.gamma2, proofC, vk.delta2);
  }
}
