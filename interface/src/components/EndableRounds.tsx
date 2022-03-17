import { useContext, useEffect, useState } from 'react'
import OwnedBots from '../contexts/OwnedBots'
import Rounds, { ArbibotRPSRound } from '../contexts/Rounds'
import { RPS_DEAD_MOVE } from '../util/constants'
import { BotSelector } from './BotSelector'

export const EndableRounds = ({ onRoundSelected }: { onRoundSelected?: (round: ArbibotRPSRound) => void }) => {
  const rounds = useContext(Rounds)
  const ownedTokenIds = useContext(OwnedBots)
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
        .filter((round) => {
          return !round.ended && round.move2 !== RPS_DEAD_MOVE && ownedTokenIds.includes(round.arbibotId1.toNumber())
        })
        .map((round) => round.arbibotId1.toNumber())
    )
  }, [rounds, ownedTokenIds])

  if (tokenIds.length === 0) {
    return <p>No rounds pending to end</p>
  }

  return <BotSelector onBotSelected={callback} tokenIds={tokenIds}></BotSelector>
}
