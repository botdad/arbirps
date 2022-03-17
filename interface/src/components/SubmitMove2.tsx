import { useContractWrite } from 'wagmi'
import { ARBIBOT_RPS_CONFIG } from '../util/constants'
import { ArbibotRPS } from '../abis/types'

export const SubmitMove2 = ({ roundId, arbibotId }: { roundId: string; arbibotId: string }) => {
  const [{ error, loading }, submitMove2] = useContractWrite(ARBIBOT_RPS_CONFIG, 'submitMove2')

  const handleSubmit = (move: number) => {
    const move2Params: ArbibotRPS.Move2ParamsStruct = {
      arbibotId,
      roundId,
      move,
      permitDeadline: 0,
      permitV: 0,
      permitR: '0x0000000000000000000000000000000000000000000000000000000000000000',
      permitS: '0x0000000000000000000000000000000000000000000000000000000000000000',
    }

    submitMove2({ args: [move2Params] })
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
