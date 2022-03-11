import { useEffect, useState } from 'react'
import { useContractRead, useContractWrite, useSignMessage } from 'wagmi'
import { BigNumber } from 'ethers'
import { useAttestProof } from '../hooks/useAttestProof'
import { ARBIBOT_RPS_CONFIG } from '../util/constants'
import { keccak256 } from 'ethers/lib/utils'
import { generateSignatureString } from '../util'

export const StartRound = () => {
  const [arbibotId, setArbibotId] = useState('')
  const [sigRequired, setSigRequired] = useState(true)

  const [proofData, proofError, proofLoading, generateProof] = useAttestProof()

  const [{ error: startRoundError, loading: startRoundLoading }, startRound] = useContractWrite(
    ARBIBOT_RPS_CONFIG,
    'startRound'
  )
  const [{ data: nonceData, error: nonceError, loading: nonceLoading }, getNonce] = useContractRead(
    ARBIBOT_RPS_CONFIG,
    'getNonce',
    { skip: true }
  )
  const [{ data: signData, error: signError, loading: signLoading }, signMessage] = useSignMessage()

  useEffect(() => {
    setSigRequired(true)
  }, [arbibotId, nonceData])

  const genProofLoading = proofLoading || nonceLoading || signLoading

  const startRoundWrapper = () => {
    const args = [
      proofData?.proof,
      BigNumber.from(arbibotId),
      proofData?.moveAttestation,
      nonceData as any as BigNumber,
    ]
    console.log(JSON.stringify(args, null, 2))
    startRound({ args })
  }

  const generateProofWrapper = async (move: string) => {
    if (genProofLoading) {
      return
    }

    try {
      let signatureHash
      if (sigRequired) {
        const result = await getNonce({ args: [arbibotId] })
        if (result.error) {
          throw result.error
        }

        const nonce = result.data as any as BigNumber
        const signature = await signMessage({
          message: generateSignatureString(nonce.toNumber(), arbibotId),
        })

        if (signature.error) {
          throw signature.error
        }

        signatureHash = keccak256(signature.data || '0x')
        setSigRequired(false)
      } else {
        signatureHash = keccak256(signData || '0x')
      }

      await generateProof({ move, secret: signatureHash })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <label>
        Arbibot id:
        <input type="text" value={arbibotId} onChange={(e) => setArbibotId(e.target.value)} />
      </label>
      <button onClick={() => generateProofWrapper('0')} disabled={genProofLoading}>
        🪨
      </button>
      <button onClick={() => generateProofWrapper('1')} disabled={genProofLoading}>
        📄
      </button>
      <button onClick={() => generateProofWrapper('2')} disabled={genProofLoading}>
        ✂️
      </button>
      <br />

      <button onClick={startRoundWrapper} disabled={!proofData}>
        Submit to chain
      </button>

      {proofLoading && <div>Generating proof</div>}
      {proofError && <div>{proofError?.message}</div>}
    </>
  )
}
