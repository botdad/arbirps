import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { useContractRead, useSignMessage } from 'wagmi'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'
import styled from 'styled-components'

import { OwnedBotSelector } from '../components/OwnedBotSelector'
import { ARBIBOT_RPS_CONFIG } from '../util/constants'
import { AttestValidMoveProof } from '../util/proofs'
import { StartRoundMove } from './StartRound/StartRoundMove'
import { StartRoundBot } from './StartRound/StartRoundBot'
import { StartRoundSubmit } from './StartRound/StartRoundSubmit'

const CloudBox = styled.div`
  background-image: url('/images/cloudblue.png');
  background-position: 50% 38%;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 20px;
  min-height: 425px;
  border-radius: 24px;
`

export const StartRound = () => {
  const [key, setKey] = useState('first')
  const [arbibotId, setArbibotId] = useState<string>()
  const [nonce, setNonce] = useState<BigNumber>()
  const [proof, setProof] = useState<AttestValidMoveProof>()

  const [{ data: nonceData }, getNonce] = useContractRead(ARBIBOT_RPS_CONFIG, 'getNonce', { skip: true })

  useEffect(() => {
    getNonce({ args: [arbibotId] })
    setProof(undefined)
  }, [arbibotId, getNonce])

  useEffect(() => {
    const anyNonceData = nonceData as any
    if (anyNonceData?._hex) {
      setNonce(nonceData as any as BigNumber)
    }
  }, [nonceData])

  return (
    <Container>
      <Row>
        <Col>
          <CloudBox>
            <h1>Start a new round</h1>
            <Tab.Container
              id="left-tabs-example"
              activeKey={key}
              onSelect={(k) => k && setKey(k)}
              defaultActiveKey="first"
            >
              <Row>
                <Col sm={2}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Bot</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second" disabled={!arbibotId}>
                        Throw
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="third"
                        disabled={arbibotId === undefined || nonce === undefined || proof === undefined}
                      >
                        Go!
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={10}>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <StartRoundBot onBotSelected={setArbibotId} onNext={() => setKey('second')}></StartRoundBot>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <StartRoundMove
                        arbibotId={arbibotId}
                        nonce={nonce}
                        onPrev={() => setKey('first')}
                        onNext={() => setKey('third')}
                        onProofGenerated={setProof}
                      ></StartRoundMove>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <StartRoundSubmit arbibotId={arbibotId} nonce={nonce} proofData={proof}></StartRoundSubmit>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </CloudBox>
        </Col>
      </Row>
    </Container>
  )
}

/*

import { useEffect, useState } from 'react'
import { useContractRead, useContractWrite, useSignMessage } from 'wagmi'
import { BigNumber } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import { useAttestProof } from '../hooks/useAttestProof'
import { ARBIBOT_RPS_CONFIG } from '../util/constants'
import { generateSignatureString } from '../util/generateSignatureString'
import { ArbibotRPS } from '../abis/types/ArbibotRPS'
import { AttestValidMoveProof } from '../util/proofs'

export const ThrowSelector = ({
  arbibotId,
  nonce,
  onProofGenerated,
}: {
  arbibotId: string
  nonce: BigNumber
  onProofGenerated?: (proof: AttestValidMoveProof) => void
}) => {
  const [sigRequired, setSigRequired] = useState(true)
  const [move, setMove] = useState('')

  const [proofData, proofError, proofLoading, generateProof] = useAttestProof()

  const [{ error: startRoundError, loading: startRoundLoading }, startRound] = useContractWrite(
    ARBIBOT_RPS_CONFIG,
    'startRound'
  )
  const [{ data: signData, error: signError, loading: signLoading }, signMessage] = useSignMessage()

  useEffect(() => {
    setSigRequired(true)
    setMove('')
  }, [arbibotId, nonce])

  useEffect(() => {
    if (proofData && onProofGenerated) {
      onProofGenerated(proofData)
    }
  }, [onProofGenerated, proofData])

  const genProofLoading = proofLoading || signLoading

  const startRoundWrapper = () => {
    if (proofData) {
      const startParams: ArbibotRPS.StartParamsStruct = {
        proof: proofData.proof,
        arbibotId: arbibotId,
        moveAttestation: proofData.moveAttestation,
        nonce,
        maxRoundTime: 0,
        permitAmount: 0,
        permitDeadline: 0,
        permitV: 0,
        permitR: '0x0000000000000000000000000000000000000000000000000000000000000000',
        permitS: '0x0000000000000000000000000000000000000000000000000000000000000000',
      }

      startRound({ args: [startParams] })
    }
  }

  const handleProofGeneration = async (move: string) => {
    if (genProofLoading) {
      return
    }

    setMove(move)

    try {
      let signatureHash
      if (sigRequired) {
        const signature = await signMessage({
          message: generateSignatureString(nonce.toNumber(), arbibotId),
        })

        if (signature.error) {
          throw signature.error
        }

        signatureHash = keccak256(signature.data || '0x')
        setSigRequired(false)
      } else {
        signatureHash = keccak256(signData || '0x')
      }

      await generateProof({ move, secret: signatureHash })
    } catch (error) {
      console.error(error)
      setMove('')
    }
  }

  return (
    <Row className="justify-content-lg-center">
      <Col md={4} lg={3}>
        <Card>
          <Card.Img variant="top" src="/images/rock.png" />
          <Card.Body className="d-grid gap-2">
            <Button
              variant={move === '0' ? 'primary' : 'outline-primary'}
              onClick={() => handleProofGeneration('0')}
              disabled={genProofLoading}
            >
              {proofLoading && move === '0' && (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                </>
              )}
              Rock
            </Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} lg={3}>
        <Card>
          <Card.Img variant="top" src="/images/paper.png" />
          <Card.Body className="d-grid gap-2">
            <Button
              variant={move === '1' ? 'primary' : 'outline-primary'}
              onClick={() => handleProofGeneration('1')}
              disabled={genProofLoading}
            >
              {proofLoading && move === '1' && (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                </>
              )}
              Paper
            </Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} lg={3}>
        <Card>
          <Card.Img variant="top" src="/images/scissors.png" />
          <Card.Body className="d-grid gap-2">
            <Button
              variant={move === '2' ? 'primary' : 'outline-primary'}
              onClick={() => handleProofGeneration('2')}
              disabled={genProofLoading}
            >
              {proofLoading && move === '2' && (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                </>
              )}
              Scissors
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

*/
