pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/mimcsponge.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";
include "./libs/calculateTotal.circom";

template revealMove(totalMoves) {
  signal input secret;
  signal input moveAttestation;
  signal output foundMove;

  component calcTotal = calculateTotal(totalMoves);
  component calcTotalVerify = calculateTotal(totalMoves);
  component mimcAttestation[totalMoves];
  component isEqual[totalMoves];

  // brute force all possible moves
  for(var move = 0; move < totalMoves; move++){
    mimcAttestation[move] = MiMCSponge(2, 220, 1);
    isEqual[move] = IsEqual();

    mimcAttestation[move].ins[0] <== move;
    mimcAttestation[move].ins[1] <== secret;
    mimcAttestation[move].k <== 0;

    isEqual[move].in[0] <== moveAttestation;
    isEqual[move].in[1] <== mimcAttestation[move].outs[0];

    // 0 * move when not equal 1 * move when equal
    calcTotal.in[move] <== isEqual[move].out * move;
    // should add up to 1 since only 1 move will be equal
    calcTotalVerify.in[move] <== isEqual[move].out;
  }

  // make sure we found one and only one match
  1 === calcTotalVerify.out;
  
  foundMove <== calcTotal.out;
}

component main {public [moveAttestation]} = revealMove(3);