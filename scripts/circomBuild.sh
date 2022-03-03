#!/bin/bash
mkdir build

for circuit in `ls circuits`; do
  name=`basename $circuit .circom`
  circom circuits/$circuit --r1cs --wasm --sym -o ./build
done