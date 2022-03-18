import { BigNumber } from 'ethers'
import { ATTEST_WASM_PATH, ATTEST_ZKEY_PATH, REVEAL_WASM_PATH, REVEAL_ZKEY_PATH } from './constants'

export interface SnarkJSProof {
  pi_a: [string, string, string]
  pi_b: [[string, string], [string, string], [string, string]]
  pi_c: [string, string, string]
}

export interface SnarkJSProofAndSignals {
  proof: SnarkJSProof
  publicSignals: string[]
}

export interface AttestValidMoveProof {
  proof: BigNumber[]
  moveAttestation: BigNumber
}

export interface RevealMoveProof {
  proof: BigNumber[]
  move: number
  moveAttestation: BigNumber
}

const proofToBigNumberArray = (proof: SnarkJSProof): BigNumber[] => {
  return [
    BigNumber.from(proof.pi_a[0]),
    BigNumber.from(proof.pi_a[1]),
    BigNumber.from(proof.pi_b[0][1]),
    BigNumber.from(proof.pi_b[0][0]),
    BigNumber.from(proof.pi_b[1][1]),
    BigNumber.from(proof.pi_b[1][0]),
    BigNumber.from(proof.pi_c[0]),
    BigNumber.from(proof.pi_c[1]),
  ]
}

export const generateAttestValidMoveProof = async (proofInput: {
  move: string
  secret: string
}): Promise<AttestValidMoveProof> => {
  const { proof, publicSignals } = (await window.snarkjs.groth16.fullProve(
    proofInput,
    ATTEST_WASM_PATH,
    ATTEST_ZKEY_PATH
  )) as SnarkJSProofAndSignals
  return { proof: proofToBigNumberArray(proof), moveAttestation: BigNumber.from(publicSignals[0]) }
}

export const generateRevealMoveProof = async (proofInput: {
  moveAttestation: string
  secret: string
}): Promise<RevealMoveProof> => {
  const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
    proofInput,
    REVEAL_WASM_PATH,
    REVEAL_ZKEY_PATH
  )

  return {
    proof: proofToBigNumberArray(proof),
    move: parseInt(publicSignals[0], 10),
    moveAttestation: BigNumber.from(publicSignals[1]),
  }
}
