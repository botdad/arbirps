import { useContext, useEffect, useState } from 'react'

import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Rounds, { ArbibotRPSRound } from '../contexts/Rounds'
import { ARBIBOT_RPS_CONFIG, BOTGOLD_DECIMALS, RPS_DEAD_MOVE } from '../util/constants'
import { BotBopper } from '../components/BotBopper'
import { formatUnits, keccak256 } from 'ethers/lib/utils'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import OwnedBots from '../contexts/OwnedBots'
import { forfeitDeadline, isEndable, isForfeitable, isPlayable } from '../util/rounds'
import { useRevealProof } from '../hooks/useRevealProof'
import { useContractWrite, useSignMessage } from 'wagmi'
import { ArbibotRPS } from '../abis/types'
import { generateSignatureString } from '../util/generateSignatureString'
import { useParams } from 'react-router-dom'
import { CloudBox } from '../components/CloudBox'
import { throwNumToString } from '../util/throwNumToString'

type DetailsParams = {
  roundId: string
}
const EmptyBot = styled.img`
  width: 100%;
  height: 100%;
  border: 4px solid black;
  border-radius: 8px;
  margin: 1px;
  background-color: white;
`

const StyledBopper = styled.div`
  border: 4px solid black;
  border-radius: 8px;
  overflow: hidden;
`

const DeadButton = styled(Button)`
  visibility: hidden;
`

export const RoundDetails = () => {
  const rounds = useContext(Rounds)
  const params = useParams<DetailsParams>()
  const [round, setRound] = useState<ArbibotRPSRound>()
  const tokenIds = useContext(OwnedBots)

  let secondsRemaining = 0
  let hoursRemaining = 0

  if (round) {
    secondsRemaining = forfeitDeadline(round) - Date.now() / 1000
    hoursRemaining = Math.floor(secondsRemaining / 60 / 60)
  }

  const [proofData, proofError, proofLoading, generateProof] = useRevealProof()
  const [{ data: signData, error: signError, loading: signLoading }, signMessage] = useSignMessage()

  const [{ error: endRoundError, loading: endRoundLoading }, endRound] = useContractWrite(
    ARBIBOT_RPS_CONFIG,
    'endRound'
  )

  const [{ error: collectForfeitError, loading: collectForfeitLoading }, collectForfeit] = useContractWrite(
    ARBIBOT_RPS_CONFIG,
    'collectForfeit'
  )

  useEffect(() => {
    const foundRound = rounds.all.find((r) => r.roundId === parseInt(params.roundId || '', 10))
    setRound(foundRound)
  }, [params.roundId, rounds])

  const erLoading = proofLoading || signLoading || endRoundLoading

  const handleEndRound = async () => {
    if (endRoundLoading || !round) {
      return
    }

    try {
      const signature = await signMessage({
        message: generateSignatureString(round.nonce, round.arbibotId1.toString()),
      })

      if (signature.error) {
        throw signature.error
      }

      const signatureHash = keccak256(signature.data || '0x')

      const proofData = await generateProof({
        moveAttestation: round.move1Attestation.toString(),
        secret: signatureHash,
      })
      const endParams: ArbibotRPS.EndParamsStruct = {
        proof: proofData.proof,
        arbibotId: round.arbibotId1,
        roundId: round.roundId,
        move1: proofData.move,
        move1Attestation: proofData.moveAttestation,
      }
      endRound({ args: [endParams] })
    } catch (error) {
      console.error(error)
    }
  }

  const handleCollectForfeit = () => {
    if (!round) return
    collectForfeit({ args: [round.arbibotId2, round.roundId] })
  }

  const opponent = () => {
    if (!round || round.move2 === RPS_DEAD_MOVE) {
      return <EmptyBot alt={'?'} src="/images/questionmark.png"></EmptyBot>
    } else {
      return (
        <StyledBopper>
          <BotBopper tokenId={round.arbibotId2.toNumber()} />
        </StyledBopper>
      )
    }
  }

  if (!round) {
    return <div>hi</div>
  }

  let winner = ''
  if (round.ended) {
    if (round.winner === 1) {
      winner = `Winner is Bot #${round.arbibotId1}`
    } else if (round.winner === 2) {
      winner = `Winner is Bot #${round.arbibotId2}`
    } else {
      winner = 'Tie game!'
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          <CloudBox>
            <Row>
              <Col xs={12} sm={6} lg={4} xl={3}>
                <h2>Who</h2>
                <Row>
                  <Col xs={5}>
                    <StyledBopper>
                      <BotBopper tokenId={round.arbibotId1.toNumber()} />
                    </StyledBopper>
                  </Col>
                  <Col xs={2} className="align-self-center text-center">
                    VS
                  </Col>
                  <Col xs={5}>{opponent()}</Col>
                </Row>
              </Col>
              <Col xs={12} sm={6} lg={8} xl={9}>
                <h2>Details</h2>
                <p>Started {new Date(round.startedAt.toNumber() * 1000).toDateString()}</p>
                <p>Wager {formatUnits(round.wager, BOTGOLD_DECIMALS)} BotGold</p>
                <p>{round.ended ? 'Round is over' : 'Round has not ended'}</p>
                {round.ended && (
                  <p>
                    Bot {round.arbibotId1.toString()} played {throwNumToString(round.move1)}
                  </p>
                )}
                {round.ended && (
                  <p>
                    Bot {round.arbibotId2.toString()} played {throwNumToString(round.move2)}
                  </p>
                )}
                {round.ended && <p>{winner}</p>}
                {isEndable(round, tokenIds) && !round.maxRoundTime.eq(0) && (
                  <p className="text-danger">
                    This round is open to forfeit
                    {secondsRemaining > 0 && (
                      <>
                        {' '}
                        in {hoursRemaining} hour{hoursRemaining === 1 ? '' : 's'}
                      </>
                    )}
                  </p>
                )}
                <Button
                  size="lg"
                  variant="primary"
                  disabled={erLoading || !isEndable(round, tokenIds)}
                  onClick={handleEndRound}
                >
                  {erLoading && (
                    <>
                      <Spinner animation="border" as="span" size="sm" role="status" aria-hidden="true" />{' '}
                    </>
                  )}
                  End round
                </Button>
                <Button
                  size="lg"
                  variant="primary"
                  disabled={collectForfeitLoading || !isForfeitable(round, tokenIds)}
                  onClick={handleCollectForfeit}
                >
                  {collectForfeitLoading && (
                    <>
                      <Spinner animation="border" as="span" size="sm" role="status" aria-hidden="true" />{' '}
                    </>
                  )}
                  Claim by forfeit
                </Button>
                <LinkContainer to={`/rounds/${round.roundId}/fight`}>
                  <Button size="lg" variant="primary" disabled={!isPlayable(round)}>
                    {false && (
                      <>
                        <Spinner animation="border" as="span" size="sm" role="status" aria-hidden="true" />{' '}
                      </>
                    )}
                    Fight!!
                  </Button>
                </LinkContainer>
              </Col>
            </Row>
          </CloudBox>
        </Col>
      </Row>
    </Container>
  )
}
