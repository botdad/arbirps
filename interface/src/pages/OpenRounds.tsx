import { useContext, useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { CloudBox } from '../components/CloudBox'
import Rounds, { ArbibotRPSRound } from '../contexts/Rounds'
import OwnedBots from '../contexts/OwnedBots'
import { Round } from '../components/Round'

export const OpenRounds = ({ onRoundSelected }: { onRoundSelected?: (round: ArbibotRPSRound) => void }) => {
  const rounds = useContext(Rounds)

  return (
    <Container>
      <Row>
        <Col>
          <CloudBox>
            <Row>
              <h1>
                {rounds.open.length} Open round{rounds.open.length !== 1 && 's'}
              </h1>
              {rounds.open.map((round) => (
                <Round key={round.roundId} round={round} />
              ))}
            </Row>
          </CloudBox>
        </Col>
      </Row>
    </Container>
  )
}
