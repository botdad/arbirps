import { useEffect, useState } from 'react'
import { useContractWrite, useSignMessage } from 'wagmi'
import { keccak256 } from 'ethers/lib/utils'
import { useRevealProof } from '../hooks/useRevealProof'
import { generateSignatureString } from '../util'
import { RevealMoveProof } from '../util/proofs'
import { ARBIBOT_RPS_CONFIG } from '../util/constants'
import { BigNumber } from 'ethers'
import { ArbibotRPS } from '../abis/types'

export const EndRound = ({
  nonce,
  arbibotId,
  roundId,
  moveAttestation,
  onGeneration,
}: {
  nonce: string
  arbibotId: string
  roundId: string
  moveAttestation: string
  onGeneration: (proofData: RevealMoveProof) => void
}) => {
  const [sigRequired, setSigRequired] = useState(true)
  const [proofData, proofError, proofLoading, generateProof] = useRevealProof()
  const [{ data: signData, error: signError, loading: signLoading }, signMessage] = useSignMessage()

  const [{ error: endRoundError, loading: endRoundLoading }, endRound] = useContractWrite(
    ARBIBOT_RPS_CONFIG,
    'endRound'
  )

  useEffect(() => {
    setSigRequired(true)
  }, [arbibotId, nonce])

  useEffect(() => {
    if (proofData) {
      onGeneration(proofData)
    }
  }, [proofData, onGeneration])

  const endRoundWrapper = () => {
    if (proofData) {
      const endParams: ArbibotRPS.EndParamsStruct = {
        proof: proofData.proof,
        arbibotId,
        roundId,
        move1: proofData.move,
        move1Attestation: proofData.moveAttestation,
      }
      endRound({ args: [endParams] })
    }
  }

  const genProofLoading = proofLoading || signLoading

  const generateProofWrapper = async () => {
    if (genProofLoading) {
      return
    }

    try {
      let signatureHash
      if (sigRequired) {
        const signature = await signMessage({
          message: generateSignatureString(parseInt(nonce, 10), arbibotId),
        })

        if (signature.error) {
          throw signature.error
        }

        signatureHash = keccak256(signature.data || '0x')
        setSigRequired(false)
      } else {
        signatureHash = keccak256(signData || '0x')
      }

      await generateProof({ moveAttestation, secret: signatureHash })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <button onClick={generateProofWrapper} disabled={genProofLoading}>
        Generate proof
      </button>
      <button onClick={endRoundWrapper} disabled={!proofData}>
        Submit to chain
      </button>

      {proofLoading && <div>Generating proof</div>}
      {proofError && <div>{proofError?.message}</div>}
    </>
  )
}
