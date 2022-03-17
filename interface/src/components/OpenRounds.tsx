import { useContext, useEffect, useState } from 'react'
import Rounds, { ArbibotRPSRound } from '../contexts/Rounds'
import { RPS_DEAD_MOVE } from '../util/constants'
import { BotSelector } from './BotSelector'

export const OpenRounds = ({ onRoundSelected }: { onRoundSelected?: (round: ArbibotRPSRound) => void }) => {
  const rounds = useContext(Rounds)
  const [tokenIds, setTokenIds] = useState<number[]>([])

  const callback = (tokenId: number) => {
    if (onRoundSelected) {
      const round = rounds.find((r) => r.arbibotId1.toNumber() === tokenId)
      if (round) onRoundSelected(round)
    }
  }

  useEffect(() => {
    setTokenIds(
      rounds
        .filter((round) => !round.ended && round.move2 === RPS_DEAD_MOVE)
        .map((round) => round.arbibotId1.toNumber())
    )
  }, [rounds])

  if (tokenIds.length === 0) {
    return <p>No open rounds</p>
  }

  return <BotSelector onBotSelected={callback} tokenIds={tokenIds}></BotSelector>
}
