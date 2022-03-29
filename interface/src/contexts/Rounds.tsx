import { createContext, PropsWithChildren, useContext } from 'react'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { useContractRead, useContractEvent } from 'wagmi'
import { ARBIBOT_RPS_CONFIG } from '../util/constants'
import { isEndable, isForfeitable, isPlayable } from '../util/rounds'
import OwnedBots from './OwnedBots'
import RoundCounts from './RoundCounts'

export type ArbibotRPSRound = {
  roundId: number
  arbibotId1: BigNumber
  arbibotId2: BigNumber
  move1Attestation: BigNumber
  wager: BigNumber
  nonce: number
  maxRoundTime: BigNumber
  startedAt: BigNumber
  move2PlayedAt: BigNumber
  move1: number
  move2: number
  winner: number
  ended: boolean
}

const defaultValue: { all: ArbibotRPSRound[]; open: ArbibotRPSRound[] } = { all: [], open: [] }
const Rounds = createContext(defaultValue)

export const RoundsProvider = (props: PropsWithChildren<any>) => {
  const tokenIds = useContext(OwnedBots)
  const { setEndable, setPlayable } = useContext(RoundCounts)
  const [rounds, setRounds] = useState<ArbibotRPSRound[]>([])
  const [{ data }, getRounds] = useContractRead(ARBIBOT_RPS_CONFIG, 'getRounds')
  useContractEvent(ARBIBOT_RPS_CONFIG, 'RoundStarted', () => getRounds())
  useContractEvent(ARBIBOT_RPS_CONFIG, 'Move2Played', () => getRounds())
  useContractEvent(ARBIBOT_RPS_CONFIG, 'RoundEnded', () => getRounds())

  const [openRounds, setOpenRounds] = useState<ArbibotRPSRound[]>([])

  useEffect(() => {
    const endable = rounds.filter((round) => isEndable(round, tokenIds) || isForfeitable(round, tokenIds))
    const playable = rounds.filter((round) => isPlayable(round))
    setEndable(endable.length)
    setPlayable(playable.length)
    setOpenRounds([...endable, ...playable])
  }, [rounds, setEndable, setPlayable, tokenIds])

  useEffect(() => {
    if (data !== undefined) {
      setRounds(
        data.map((d, i): ArbibotRPSRound => {
          return {
            roundId: i,
            arbibotId1: d.arbibotId1 as BigNumber,
            arbibotId2: d.arbibotId2 as BigNumber,
            move1Attestation: d.move1Attestation as BigNumber,
            wager: d.wager as BigNumber,
            nonce: d.nonce as number,
            maxRoundTime: d.maxRoundTime as BigNumber,
            startedAt: d.startedAt as BigNumber,
            move2PlayedAt: d.move2PlayedAt as BigNumber,
            move1: d.move1 as number,
            move2: d.move2 as number,
            ended: d.ended as boolean,
            winner: d.winner as number,
          }
        })
      )
    }
  }, [data])

  return <Rounds.Provider {...props} value={{ all: rounds, open: openRounds }} />
}

export default Rounds
