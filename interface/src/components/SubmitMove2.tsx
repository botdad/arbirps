import { useState } from 'react'
import { useContractWrite } from 'wagmi'
import { BigNumber } from 'ethers'
import ArbibotRPSAbi from '../abis/ArbibotRPS.json'
import { ARBIBOT_RPS_ADDRESS } from '../util/constants'

const ARBIBOT_RPS_CONFIG = { addressOrName: ARBIBOT_RPS_ADDRESS, contractInterface: ArbibotRPSAbi }

export const SubmitMove2 = ({ roundId }: { roundId: string }) => {
  const [arbibotId, setArbibotId] = useState('')

  const [{ error, loading }, submitMove2] = useContractWrite(ARBIBOT_RPS_CONFIG, 'submitMove2')

  const handleSubmit = (move: number) => {
    submitMove2({ args: [BigNumber.from(arbibotId), BigNumber.from(roundId), move] })
  }

  return (
    <>
      <label>
        Arbibot id:
        <input type="text" value={arbibotId} onChange={(e) => setArbibotId(e.target.value)} />
      </label>
      <button onClick={() => handleSubmit(0)} disabled={loading}>
        🪨
      </button>
      <button onClick={() => handleSubmit(1)} disabled={loading}>
        📄
      </button>
      <button onClick={() => handleSubmit(2)} disabled={loading}>
        ✂️
      </button>
      {error && <div>{error?.message}</div>}
    </>
  )
}
