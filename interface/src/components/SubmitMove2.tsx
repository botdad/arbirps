import { useContractWrite } from 'wagmi'
import { BigNumber } from 'ethers'
import { ARBIBOT_RPS_CONFIG } from '../util/constants'

export const SubmitMove2 = ({ roundId, arbibotId }: { roundId: string; arbibotId: string }) => {
  const [{ error, loading }, submitMove2] = useContractWrite(ARBIBOT_RPS_CONFIG, 'submitMove2')

  const handleSubmit = (move: number) => {
    submitMove2({ args: [BigNumber.from(arbibotId), BigNumber.from(roundId), move] })
  }

  return (
    <>
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
