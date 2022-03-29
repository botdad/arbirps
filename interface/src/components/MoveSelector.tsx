import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export const MoveSelector = ({
  move,
  setMove,
  disabled,
  onMoveSelected,
}: {
  move?: string
  setMove?: React.Dispatch<React.SetStateAction<string | undefined>>
  disabled?: boolean
  onMoveSelected?: (move: string) => void
}) => {
  let [altMove, altSetMove] = useState<string>()
  if (setMove === undefined) {
    move = altMove
    setMove = altSetMove
  }

  const handleMoveSelected = async (move: string) => {
    setMove && setMove(move)
    if (onMoveSelected) {
      onMoveSelected(move)
    }
  }

  return (
    <Row className="justify-content-lg-center">
      <Col md={4} lg={3}>
        <Card>
          <Card.Img variant="top" src="/images/rockbot.png" />
          <Card.Body className="d-grid gap-2">
            <Button
              size="lg"
              variant={move === '0' ? 'primary' : 'outline-primary'}
              onClick={() => handleMoveSelected('0')}
              disabled={disabled}
            >
              Rock
            </Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} lg={3}>
        <Card>
          <Card.Img variant="top" src="/images/paperbot.png" />
          <Card.Body className="d-grid gap-2">
            <Button
              size="lg"
              variant={move === '1' ? 'primary' : 'outline-primary'}
              onClick={() => handleMoveSelected('1')}
              disabled={disabled}
            >
              Paper
            </Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} lg={3}>
        <Card>
          <Card.Img variant="top" src="/images/scissorbot.png" />
          <Card.Body className="d-grid gap-2">
            <Button
              size="lg"
              variant={move === '2' ? 'primary' : 'outline-primary'}
              onClick={() => handleMoveSelected('2')}
              disabled={disabled}
            >
              Scissors
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
