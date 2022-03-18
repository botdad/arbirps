// modified from https://github.com/darkforest-eth/circuits/blob/master/perlin/CalculateTotal.circom
pragma circom 2.0.0;

template calculateTotal(n) {
  signal input in[n];
  signal output out;

  signal sums[n];

  sums[0] <== in[0];

  for (var i = 1; i < n; i++) {
    sums[i] <== sums[i-1] + in[i];
  }

out <== sums[n-1];
}