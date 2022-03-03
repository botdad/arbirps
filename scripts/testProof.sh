#!/bin/bash
mkdir tmp
move="1"
secret="123152419872319823719238712098"

echo "{ \"move\": \"${move}\", \"secret\": \"${secret}\" }" > tmp/attestValidMove_input.json
node build/attestValidMove_js/generate_witness.js build/attestValidMove_js/attestValidMove.wasm  tmp/attestValidMove_input.json tmp/attestValidMove_witness.wtns && \
  yarn run snarkjs groth16 prove build/attestValidMove_0001.zkey tmp/attestValidMove_witness.wtns tmp/attestValidMove_proof.json tmp/attestValidMove_public.json && \
  yarn run snarkjs groth16 verify build/attestValidMove_verification_key.json tmp/attestValidMove_public.json tmp/attestValidMove_proof.json

attestation=`jq -r ".[0]" tmp/attestValidMove_public.json`

echo "{\"moveAttestation\": \"${attestation}\", \"secret\": \"${secret}\"}" > tmp/revealMove_input.json

node build/revealMove_js/generate_witness.js build/revealMove_js/revealMove.wasm  tmp/revealMove_input.json tmp/revealMove_witness.wtns && \
  yarn run snarkjs groth16 prove build/revealMove_0001.zkey tmp/revealMove_witness.wtns tmp/revealMove_proof.json tmp/revealMove_public.json && \
  yarn run snarkjs groth16 verify build/revealMove_verification_key.json tmp/revealMove_public.json tmp/revealMove_proof.json

jq -r "." tmp/revealMove_public.json