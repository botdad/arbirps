import { useState } from 'react'
import styled from 'styled-components'
interface Props {
  selected: boolean
}

// border: ${(props) => (props.selected ? '5px solid transparent' : '2px solid white')};
const BotImageContainer = styled.div`
  margin: 1px;
  width: 136px;
  height: 136px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
`
const BotImageBorder = styled.div<Props>`
  display: ${(props) => (props.selected ? 'block' : 'none')};
  background-image: linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%);
  width: 138px;
  height: 138px;
  position: absolute;
  animation: spin 3s linear infinite;
  -moz-animation: spin 3s linear infinite;
  -webkit-animation: spin 3s linear infinite;
  -ms-animation: spin 3s linear infinite;
`
const BotImage = styled.img<Props>`
  border: ${(props) => (props.selected ? '4px solid transparent' : '4px solid black')};
  width: 128px;
  height: 128px;
  position: absolute;
`

const BotGold = styled.img`
  margin: 37px;
  width: 64px;
  height: 64px;
`

const BotsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 690px;
`

const EmptyBot = styled.img`
  padding: 27px 37px;
  width: 54px;
  height: 74px;
  border: 4px solid black;
  margin: 1px;
  filter: grayscale(100%);
`

export const BotSelector = ({
  tokenIds,
  onBotSelected,
}: {
  tokenIds: number[]
  onBotSelected?: (tokenId: number) => void
}) => {
  const [selectedId, setSelectedId] = useState(-1)

  let i = 0
  const renderAtIndex = (filledWithBot: boolean, mapIndex: number) => {
    if (filledWithBot && i < tokenIds.length) {
      const tokenId = tokenIds[i]
      const selected = tokenId === selectedId
      const elements = (
        <BotImageContainer
          key={mapIndex}
          onClick={() => {
            setSelectedId(tokenId)
            if (onBotSelected) onBotSelected(tokenId)
          }}
        >
          <BotImageBorder selected={selected} />
          <BotImage selected={selected} alt={`Arbit #${tokenId}`} src={`/images/arbibots/${tokenId}.png`}></BotImage>
        </BotImageContainer>
      )
      i++
      return elements
    } else if (!filledWithBot) {
      return <BotGold key={mapIndex} alt={'BotGold'} src={`/images/botgold.png`}></BotGold>
    } else {
      return <EmptyBot key={mapIndex} alt={'?'} src={'/images/questionmark.png'}></EmptyBot>
    }
  }

  return <BotsContainer>{[true, true, false, true, true, true, true, true].map(renderAtIndex)}</BotsContainer>
}
