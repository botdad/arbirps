#!/bin/bash

for circuit in `find src -name "*.circom" -maxdepth 1`; do
  name=`basename $circuit .circom`
  yarn run snarkjs groth16 setup circuits/build/$name.r1cs circuits/tau/powersOfTau28_hez_final_11.ptau circuits/build/${name}_0000.zkey && \
    yarn run snarkjs zkey contribute circuits/build/${name}_0000.zkey circuits/ceremony/${name}_0001.zkey --name="1st Contributor to ${name}" -v && \
    yarn run snarkjs zkey export verificationkey circuits/ceremony/${name}_0001.zkey circuits/ceremony/${name}_verification_key.json
done