import { useContext } from 'react'
import OwnedBots from '../contexts/OwnedBots'
import { BotSelector } from './BotSelector'

export const OwnedBotSelector = ({ onBotSelected }: { onBotSelected?: (tokenId: number) => void }) => {
  const tokenIds = useContext(OwnedBots)

  return <BotSelector onBotSelected={onBotSelected} tokenIds={tokenIds}></BotSelector>
}
