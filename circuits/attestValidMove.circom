pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/mimcsponge.circom";

template attestValidMove () {
  signal input move;
  signal input secret;
  signal output moveAttestation;

  component mimcAttestation = MiMCSponge(2, 220, 1);

  signal temp;
  temp <== (move - 1) * (move - 2);
  0 === temp * move; // ensure that the move is 0, 1, or 2

  mimcAttestation.ins[0] <== move;
  mimcAttestation.ins[1] <== secret;
  mimcAttestation.k <== 0;

  moveAttestation <== mimcAttestation.outs[0];
}

component main = attestValidMove();