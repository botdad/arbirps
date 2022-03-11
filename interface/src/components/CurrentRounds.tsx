import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'
import ArbibotRPSAbi from '../abis/ArbibotRPS.json'
import { ARBIBOT_RPS_ADDRESS } from '../util/constants'

const ARBIBOT_RPS_CONFIG = { addressOrName: ARBIBOT_RPS_ADDRESS, contractInterface: ArbibotRPSAbi }
export type ArbibotRPSRound = {
  roundId: number
  arbibotId1: BigNumber
  arbibotId2: BigNumber
  winner: BigNumber
  move1Attestation: BigNumber
  nonce: BigNumber
  move1: number
  move2: number
  ended: boolean
}

export const CurrentRounds = ({ onRoundSelected }: { onRoundSelected?: (round: ArbibotRPSRound) => void }) => {
  const [rounds, setRounds] = useState<ArbibotRPSRound[]>([])
  const [{ data, error, loading }] = useContractRead(ARBIBOT_RPS_CONFIG, 'getRounds')

  useEffect(() => {
    if (data !== undefined) {
      setRounds(
        data.map((d, i): ArbibotRPSRound => {
          return {
            roundId: i,
            arbibotId1: d.arbibotId1 as BigNumber,
            arbibotId2: d.arbibotId2 as BigNumber,
            winner: d.winner as BigNumber,
            move1Attestation: d.move1Attestation as BigNumber,
            nonce: d.nonce as BigNumber,
            move1: d.move1 as number,
            move2: d.move2 as number,
            ended: d.ended as boolean,
          }
        })
      )
    }
  }, [data])

  const callback = (round: ArbibotRPSRound) => {
    if (onRoundSelected) {
      onRoundSelected(round)
    }
  }

  return (
    <>
      {rounds.map((round, index) => (
        <button key={round.roundId} onClick={() => callback(round)}>
          {round.arbibotId1.toString()} vs {round.arbibotId2.toString()}
        </button>
      ))}
      <pre>{JSON.stringify(rounds, null, 2)}</pre>
    </>
  )
}
