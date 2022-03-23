import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { OwnedBotSelector } from '../../components/OwnedBotSelector'

export const StartRoundBot = ({
  onNext,
  onBotSelected,
}: {
  onNext: () => void
  onBotSelected: (tokenId: string) => void
}) => {
  const [allowNext, setAllowNext] = useState(false)

  return (
    <>
      <OwnedBotSelector
        onBotSelected={(id) => {
          onBotSelected(`${id}`)
          setAllowNext(true)
        }}
      ></OwnedBotSelector>
      <Row>
        <Col xs={12} className="text-end">
          <Button size="lg" onClick={onNext} disabled={!allowNext}>
            Next
          </Button>
        </Col>
      </Row>
    </>
  )
}
