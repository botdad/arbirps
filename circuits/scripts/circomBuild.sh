#!/bin/bash
mkdir build

for circuit in `ls src`; do
  name=`basename $circuit .circom`
  circom src/$circuit --r1cs --wasm --sym -o ./build
done