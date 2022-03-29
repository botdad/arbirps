import { ArbibotRPSRound } from '../contexts/Rounds'
import { RPS_DEAD_MOVE } from './constants'

export const isEndable = (round: ArbibotRPSRound, tokenIds: number[]): boolean => {
  return !round.ended && round.move2 !== RPS_DEAD_MOVE && tokenIds.includes(round.arbibotId1.toNumber())
}

export const isPlayable = (round: ArbibotRPSRound): boolean => {
  return !round.ended && round.move2 === RPS_DEAD_MOVE
}

export const isForfeitable = (round: ArbibotRPSRound, tokenIds: number[]): boolean => {
  return (
    !round.ended &&
    round.move2 !== RPS_DEAD_MOVE &&
    tokenIds.includes(round.arbibotId2.toNumber()) &&
    isAfterForfeit(round)
  )
}

export const forfeitDeadline = (round: ArbibotRPSRound): number => {
  return round.maxRoundTime.add(round.move2PlayedAt).toNumber()
}

export const isAfterForfeit = (round: ArbibotRPSRound): boolean => {
  const nowInSeconds = Date.now() / 1000

  return nowInSeconds > forfeitDeadline(round)
}
