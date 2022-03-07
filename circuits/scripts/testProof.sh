#!/bin/bash
mkdir tmp
move="2"
secret="123152419872319823719238712098"

echo "{ \"move\": \"${move}\", \"secret\": \"${secret}\" }" > tmp/attestValidMove_input.json
node build/attestValidMove_js/generate_witness.js \
  build/attestValidMove_js/attestValidMove.wasm \
  tmp/attestValidMove_input.json \
  tmp/attestValidMove_witness.wtns && \
  yarn run snarkjs groth16 prove \
    circuits/ceremony/attestValidMove_0001.zkey \
    circuits/tmp/attestValidMove_witness.wtns \
    circuits/tmp/attestValidMove_proof.json \
    circuits/tmp/attestValidMove_public.json && \
  yarn run snarkjs groth16 verify \
    circuits/ceremony/attestValidMove_verification_key.json \
    circuits/tmp/attestValidMove_public.json \
    circuits/tmp/attestValidMove_proof.json && \
  yarn -s run snarkjs generatecall \
    circuits/tmp/attestValidMove_public.json \
    circuits/tmp/attestValidMove_proof.json | sed 's/^/\[/; s/$/\]/' | jq -r

attestation=`jq -r ".[0]" tmp/attestValidMove_public.json`

echo "{\"moveAttestation\": \"${attestation}\", \"secret\": \"${secret}\"}" > tmp/revealMove_input.json

node build/revealMove_js/generate_witness.js \
  build/revealMove_js/revealMove.wasm \
  tmp/revealMove_input.json \
  tmp/revealMove_witness.wtns && \
  yarn run snarkjs groth16 prove \
    circuits/ceremony/revealMove_0001.zkey \
    circuits/tmp/revealMove_witness.wtns \
    circuits/tmp/revealMove_proof.json \
    circuits/tmp/revealMove_public.json && \
  yarn run snarkjs groth16 verify \
    circuits/ceremony/revealMove_verification_key.json \
    circuits/tmp/revealMove_public.json \
    circuits/tmp/revealMove_proof.json && \
  yarn -s run snarkjs generatecall \
    circuits/tmp/revealMove_public.json \
    circuits/tmp/revealMove_proof.json | sed 's/^/\[/; s/$/\]/' | jq -r
