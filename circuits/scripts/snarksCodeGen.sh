#!/bin/bash

for circuit in `find src -name "*.circom" -maxdepth 1`; do
  name=`basename $circuit .circom`
  yarn run snarkjs zkey export solidityverifier circuits/ceremony/${name}_0001.zkey contracts/src/${name}Verifier2.sol
done