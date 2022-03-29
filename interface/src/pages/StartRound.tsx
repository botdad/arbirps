import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { useContractRead } from 'wagmi'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

import { ARBIBOT_RPS_CONFIG } from '../util/constants'
import { AttestValidMoveProof } from '../util/proofs'
import { StartRoundMove } from './StartRound/StartRoundMove'
import { StartRoundBot } from './StartRound/StartRoundBot'
import { StartRoundSubmit } from './StartRound/StartRoundSubmit'
import { CloudBox } from '../components/CloudBox'

export const StartRound = () => {
  const [key, setKey] = useState('first')
  const [arbibotId, setArbibotId] = useState<string>()
  const [nonce, setNonce] = useState<BigNumber>()
  const [proof, setProof] = useState<AttestValidMoveProof>()
  const [txHash, setTxHash] = useState<string>()

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

  const handleRoundSubmitted = (tx: TransactionResponse) => {
    setTxHash(tx.hash)
    setKey('fourth')
  }

  const handleStartOver = () => {
    setKey('first')
    setArbibotId(undefined)
    setNonce(undefined)
    setProof(undefined)
    setTxHash(undefined)
  }

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
                      <StartRoundSubmit
                        onPrev={() => setKey('second')}
                        arbibotId={arbibotId}
                        nonce={nonce}
                        proofData={proof}
                        onRoundSubmitted={handleRoundSubmitted}
                      ></StartRoundSubmit>
                    </Tab.Pane>
                    <Tab.Pane eventKey="fourth">
                      <Row>
                        <Col md={{ offset: 2, span: 8 }}>
                          <br />
                          <h4>All done!!</h4>
                          <div className="d-grid">
                            <Button
                              variant="primary"
                              size="lg"
                              target="_blank"
                              rel="noreferrer"
                              href={`https://arbiscan.io/tx/${txHash}`}
                            >
                              Check arbiscan
                            </Button>
                          </div>
                          <br />
                          <div className="d-grid">
                            <Button variant="primary" size="lg" onClick={handleStartOver}>
                              Start Over
                            </Button>
                          </div>
                        </Col>
                      </Row>
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
