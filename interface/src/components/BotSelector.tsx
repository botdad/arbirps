import { useState } from 'react'
import styled from 'styled-components'

const BotImage = styled((props: any) => <img {...props} alt={props.alt} />)`
  border: ${(props) => (props.selected ? '2px solid palevioletred' : '2px solid white')};
  width: 128px;
  height: 128px;
  cursor: pointer;
`

export const BotSelector = ({
  tokenIds,
  onBotSelected,
}: {
  tokenIds: number[]
  onBotSelected?: (tokenId: number) => void
}) => {
  const [selectedId, setSelectedId] = useState(-1)

  return (
    <>
      {tokenIds.map((tokenId, index) => (
        <BotImage
          key={tokenId}
          selected={tokenId === selectedId}
          alt={`Arbit #${tokenId}`}
          src={`/images/arbibots/${tokenId}.png`}
          onClick={() => {
            setSelectedId(tokenId)
            if (onBotSelected) onBotSelected(tokenId)
          }}
        ></BotImage>
      ))}
    </>
  )
}
