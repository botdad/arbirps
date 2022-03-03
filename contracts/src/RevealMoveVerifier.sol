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
    // THIS DIFFERS
    vk.delta2 = Pairing.G2Point(
      [
        19676249277080590238858911179633484650285176591399094200626010226520062733247,
        16323457682232177041645559528237650039925205726099801299444480410188892071871
      ],
      [
        20791176793409307531967276957382538547439209604574855314913475869471554634740,
        9113213922331031798191617442844638885946648375147452871860844657855401082520
      ]
    );
    vk.IC = new Pairing.G1Point[](5);

    vk.IC[0] = Pairing.G1Point(
      7574443223402709415661696407538121183244641302302045131378895682646676402216,
      6878026905834860924898857797181616680791407426455575099477629235194061339824
    );

    vk.IC[1] = Pairing.G1Point(
      15567807918927488560234763580101385512130233695339456022630073288886373389980,
      10480099272008917829510844557240145969420619827010258492955186820948415589608
    );

    vk.IC[2] = Pairing.G1Point(
      14585973276001086815832993056331042251965504706561256739929223895022179228309,
      5383184020657261684035335361627058045285183671327658888413637990125450359655
    );

    vk.IC[3] = Pairing.G1Point(
      13871881695432197422861319168295128921808083351518293438437138929716658975350,
      14480061495513748534373035622755309342377954323815194176570972528377266518636
    );

    vk.IC[4] = Pairing.G1Point(
      8416910592529187941839645098347422350255071054331182933500638840389006053556,
      13196695993685284419869719432503149415522054454098707414452277790537527086152
    );
  }

  function verifyProof(bytes memory proof, uint256[4] memory input) internal view returns (bool) {
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
