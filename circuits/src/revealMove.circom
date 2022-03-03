pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/mimcsponge.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

template revealMove(N) {
  signal input secret;
  signal input moveAttestation;
  signal output move[N];

  component mimcAttestation[N];
  component isEqual[N];

  for(var i = 0; i < N; i++){
    mimcAttestation[i] = MiMCSponge(2, 220, 1);
    isEqual[i] = IsEqual();

    mimcAttestation[i].ins[0] <== i;
    mimcAttestation[i].ins[1] <== secret;
    mimcAttestation[i].k <== 0;

    isEqual[i].in[0] <== moveAttestation;
    isEqual[i].in[1] <== mimcAttestation[i].outs[0];

    move[i] <== isEqual[i].out;
  }
}

component main {public [moveAttestation]} = revealMove(3);