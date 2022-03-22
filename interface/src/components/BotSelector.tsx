import { useContext, useState } from 'react'
import Pagination from 'react-bootstrap/Pagination'
import styled from 'styled-components'
import GlobalError from '../contexts/GlobalError'

type Props = {
  selected: boolean
}

// border: ${(props) => (props.selected ? '5px solid transparent' : '2px solid white')};
const BotImageContainer = styled.div`
  border-radius: 8px;
  margin: 1px;
  width: 128px;
  height: 128px;
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
  border-radius: 8px;
  position: absolute;
`

const BotGold = styled.img`
  margin: 33px;
  width: 64px;
  height: 64px;
`

const BotsContainer = styled.div`
  display: flex;
  justify-content: center;
`

const EmptyBot = styled.img`
  padding: 27px 37px;
  width: 128px;
  height: 128px;
  border: 4px solid black;
  border-radius: 8px;
  margin: 1px;
  filter: grayscale(100%);
  cursor: pointer;
  background-color: white;
`
const PlaceHolder = styled.div`
  width: 128px;
  height: 128px;
  border: 4px solid transparent;
  border-radius: 8px;
  margin: 1px;
`

export const BotSelector = ({
  tokenIds,
  onBotSelected,
}: {
  tokenIds: number[]
  onBotSelected?: (tokenId: number) => void
}) => {
  const { show } = useContext(GlobalError)
  const [selectedId, setSelectedId] = useState(-1)
  const [page, setPage] = useState(0)

  let items = []
  let pages = Math.ceil(tokenIds.length / 7)

  for (let number = 0; number < pages; number++) {
    items.push(
      <Pagination.Item key={number} active={number === page} onClick={() => setPage(number)}>
        {number + 1}
      </Pagination.Item>
    )
  }

  const handleShow = () => {
    const content = (
      <>
        Looks like your quiver is a bit empty there friend. Connect with an account that has some Arbibots or try{' '}
        <a
          href="https://tofunft.com/collection/arbibots/items"
          className="link-primary"
          target="_blank"
          rel="noreferrer"
        >
          Tofu NFT
        </a>{' '}
        or{' '}
        <a
          href="https://smolpuddle.io/#/0xc1fCf330b4B4C773fA7e6835f681E8F798E9eBff"
          className="link-primary"
          target="_blank"
          rel="noreferrer"
        >
          SmolPuddle
        </a>
        .
      </>
    )

    show(content)
  }

  const renderAtIndex = (index: number) => {
    const pagedIndex = page * 7 + index
    if (pagedIndex < tokenIds.length) {
      const tokenId = tokenIds[pagedIndex]
      const selected = tokenId === selectedId
      const elements = (
        <BotImageContainer
          onClick={() => {
            setSelectedId(tokenId)
            if (onBotSelected) onBotSelected(tokenId)
          }}
        >
          <BotImageBorder selected={selected} />
          <BotImage
            selected={selected}
            alt={`Arbit #${tokenId}`}
            src={`/images/arbibots/${tokenId}.png`}
            onMouseOver={(e) => (e.currentTarget.src = `/images/bounce/${tokenId}.gif`)}
            onMouseOut={(e) => (e.currentTarget.src = `/images/arbibots/${tokenId}.png`)}
          ></BotImage>
        </BotImageContainer>
      )
      return elements
    } else {
      return <EmptyBot onClick={handleShow} alt={'?'} src={'/images/questionmark.png'}></EmptyBot>
    }
  }

  return (
    <>
      <BotsContainer>
        {renderAtIndex(0)}
        {renderAtIndex(1)}
        <BotGold className="d-none d-lg-block" alt={'BotGold'} src={`/images/botgold.png`}></BotGold>
        {renderAtIndex(2)}
        {renderAtIndex(3)}
      </BotsContainer>
      <BotsContainer>
        {/* <PlaceHolder></PlaceHolder> */}
        {renderAtIndex(4)}
        {renderAtIndex(5)}
        {renderAtIndex(6)}
      </BotsContainer>
      {pages > 1 && (
        <BotsContainer>
          <Pagination>{items}</Pagination>
        </BotsContainer>
      )}
    </>
  )
}
