#!/bin/bash

for circuit in `ls src`; do
  name=`basename $circuit .circom`
  yarn run snarkjs zkey export solidityverifier circuits/build/${name}_0001.zkey contracts/src/${name}Verifier2.sol
done