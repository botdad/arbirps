import { BigNumber } from 'ethers'
import { useCallback, useState } from 'react'
import { generateAttestValidMoveProof } from '../util/proofs'

export const useAttestProof = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [moveAttestation, setMoveAttestation] = useState(BigNumber.from(0))
  const [proof, setProof] = useState<BigNumber[]>([])

  const generate = useCallback(async ({ move, secret }: { move: string; secret: string }) => {
    setLoading(true)
    setError(null)
    try {
      const proofAndInput = await generateAttestValidMoveProof({ move, secret })

      setProof(proofAndInput.proof)
      setMoveAttestation(proofAndInput.moveAttestation)
      setLoading(false)
    } catch (_error) {
      const error = _error as Error
      setError(error as Error)
      setLoading(false)
    }
  }, [])

  return [
    {
      proof,
      moveAttestation,
    },
    error,
    loading,
    generate,
  ] as const
}
