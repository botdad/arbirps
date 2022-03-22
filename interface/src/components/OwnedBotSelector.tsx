import { useContext } from 'react'
import OwnedBots from '../contexts/OwnedBots'
import { BotSelector } from './BotSelector'

export const OwnedBotSelector = ({ onBotSelected }: { onBotSelected?: (tokenId: number) => void }) => {
  const tokenIds = useContext(OwnedBots)

  return <BotSelector onBotSelected={onBotSelected} tokenIds={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}></BotSelector>
}
