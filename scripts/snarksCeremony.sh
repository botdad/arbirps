#!/bin/bash

for circuit in `ls circuits`; do
  name=`basename $circuit .circom`
  yarn run snarkjs groth16 setup build/$name.r1cs tau/powersOfTau28_hez_final_11.ptau build/${name}_0000.zkey
  yarn run snarkjs zkey contribute build/${name}_0000.zkey build/${name}_0001.zkey --name="1st Contributor to ${name}" -v
  yarn run snarkjs zkey export verificationkey build/${name}_0001.zkey build/${name}_verification_key.json
done