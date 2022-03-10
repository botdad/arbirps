import { FormEvent, useState } from 'react'
import { useContractWrite } from 'wagmi'
import { useAttestProof } from '../hooks/useAttestProof'
import ArbibotRPSAbi from '../abis/ArbibotRPS.json'
import { ARBIBOT_RPS_ADDRESS } from '../util/constants'

export const GenerateMove = () => {
  const [arbibotId, setArbibotId] = useState(0)
  const [move, setMove] = useState('')
  const [secret, setSecret] = useState('')
  const [proofData, proofError, proofLoading, generate] = useAttestProof()
  console.log(proofData.proof.length)

  const [{ error: writeError, loading: writeLoading }, startRound] = useContractWrite(
    { addressOrName: ARBIBOT_RPS_ADDRESS, contractInterface: ArbibotRPSAbi },
    'startRound'
  )

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (proofLoading) return
    generate({ move, secret })
  }

  const startRoundWrapper = () => {
    if (proofError || proofLoading || proofData.proof.length === 0) {
      console.log('no proof to submit')
      return
    }

    console.log('hrm', { args: [proofData.proof, arbibotId, proofData.moveAttestation] })

    startRound({ args: [proofData.proof, arbibotId, proofData.moveAttestation] })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Move:
          <input type="text" value={move} onChange={(e) => setMove(e.target.value)} />
        </label>
        <label>
          Secret:
          <input type="text" value={secret} onChange={(e) => setSecret(e.target.value)} />
        </label>
        <input type="submit" value="Submit" disabled={proofLoading} />
      </form>

      {proofLoading && <div>Generating proof</div>}
      {proofError && <div>{proofError?.message}</div>}
      <button onClick={startRoundWrapper}>start round</button>
    </>
  )
}
