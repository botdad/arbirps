import { useContext } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { CloudBox } from '../components/CloudBox'
import RoundsContext, { ArbibotRPSRound } from '../contexts/Rounds'
import { Round } from '../components/Round'

export const Rounds = ({ onRoundSelected }: { onRoundSelected?: (round: ArbibotRPSRound) => void }) => {
  const rounds = useContext(RoundsContext)

  return (
    <Container>
      <Row>
        <Col>
          <CloudBox>
            <Row>
              <h1>
                {rounds.all.length} round{rounds.all.length !== 1 && 's'}
              </h1>
              {rounds.all.map((round) => (
                <Round key={round.roundId} round={round} />
              ))}
            </Row>
          </CloudBox>
        </Col>
      </Row>
    </Container>
  )
}
