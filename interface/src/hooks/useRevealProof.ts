import { useCallback, useState } from 'react'
import { generateRevealMoveProof, RevealMoveProof } from '../util/proofs'

export const useRevealProof = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const [proof, setProof] = useState<RevealMoveProof | undefined>()

  const generate = useCallback(async ({ moveAttestation, secret }: { moveAttestation: string; secret: string }) => {
    setLoading(true)
    setError(undefined)
    setProof(undefined)

    try {
      const proofAndInput = await generateRevealMoveProof({ moveAttestation, secret })

      setProof(proofAndInput)
      setLoading(false)

      return proofAndInput
    } catch (_error) {
      const error = _error as Error
      setError(error as Error)
      setProof(undefined)
      setLoading(false)
    }
  }, [])

  return [proof, error, loading, generate] as const
}
