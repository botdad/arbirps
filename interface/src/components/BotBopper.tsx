import styled from 'styled-components'

const BotImage = styled.img`
  width: 100%;
  height: 100%;
`

export const BotBopper = ({ tokenId }: { tokenId: number }) => {
  return (
    <BotImage
      alt={`Arbit #${tokenId}`}
      src={`/images/arbibots/${tokenId}.png`}
      onMouseOver={(e) => (e.currentTarget.src = `/images/bounce/${tokenId}.gif`)}
      onMouseOut={(e) => (e.currentTarget.src = `/images/arbibots/${tokenId}.png`)}
    ></BotImage>
  )
}
