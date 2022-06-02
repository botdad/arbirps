import { Fragment, useContext, useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { CloudBox } from '../components/CloudBox'
import Rounds, { ArbibotRPSRound } from '../contexts/Rounds'
import {
  ARBIBOT_RPS_ADDRESS,
  ARBIBOT_RPS_CONFIG,
  BOTGOLD_CONFIG,
  BOTGOLD_DECIMALS,
  BOTGOLD_EIP_2612_DOMAIN,
  EIP_2612_TYPES,
} from '../util/constants'
import { BotBopper } from '../components/BotBopper'
import { formatUnits, splitSignature } from 'ethers/lib/utils'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { OwnedBotSelector } from '../components/OwnedBotSelector'
import { MoveSelector } from '../components/MoveSelector'
import { useAccount, useContractRead, useContractWrite, useNetwork, useSignTypedData } from 'wagmi'
import { Signature } from 'ethers'
import { ArbibotRPS } from '../abis/types'

type FightParams = {
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

const BotImage = styled.img`
  width: 100%;
  height: 100%;
`

export const RoundFight = () => {
  const [move, setMove] = useState<string>()
  const rounds = useContext(Rounds)
  const params = useParams<FightParams>()
  const [round, setRound] = useState<ArbibotRPSRound>()
  const [section, setSection] = useState<number>(0)
  const [tokenId, setTokenId] = useState<number>()
  const [permitDeadline, setPermitDeadline] = useState(0)
  const [permitSignature, setPermitSignature] = useState<Signature>()

  const [{ data: accountData }] = useAccount()
  const [{ data: networkData }] = useNetwork()
  const [{ data: signatureData, error: signatureError, loading: signatureLoading }, signTypedData] = useSignTypedData()
  const [{ data: nonceData, error: nonceError, loading: nonceLoading }, getNonce] = useContractRead(
    BOTGOLD_CONFIG,
    'nonces',
    { args: [accountData?.address] }
  )

  const [{ error: submitMove2Error, loading: submitMove2Loading }, submitMove2] = useContractWrite(
    ARBIBOT_RPS_CONFIG,
    'submitMove2'
  )

  useEffect(() => {
    const foundRound = rounds.all.find((r) => r.roundId === parseInt(params.roundId || '', 10))
    setRound(foundRound)
  }, [params.roundId, rounds])

  useEffect(() => {
    if (signatureData) {
      const signature = splitSignature(signatureData)
      setPermitSignature(signature)
    }
  }, [signatureData])

  const handleSignPermit = () => {
    if (!accountData || !networkData.chain || !round) {
      return
    }

    const deadline = Math.floor(Date.now() / 1000) + 60 * 5
    setPermitDeadline(deadline)

    const value = {
      owner: accountData.address,
      spender: ARBIBOT_RPS_ADDRESS,
      value: round.wager,
      nonce: nonceData,
      deadline,
    }

    signTypedData({ domain: BOTGOLD_EIP_2612_DOMAIN, types: EIP_2612_TYPES, value })
  }

  const submitMoveDisabled = () => {
    if (!round) return true
    if (round.wager.eq(0)) return false
    if (!round.wager.eq(0) && !permitSignature) return true

    return false
  }

  const handleSubmitMove2 = async () => {
    if (!round || (!round.wager.eq(0) && !permitSignature) || !tokenId || !move) {
      return
    }

    const move2Params: ArbibotRPS.Move2ParamsStruct = {
      arbibotId: tokenId,
      roundId: round.roundId,
      move,
      permitDeadline: permitDeadline,
      permitV: permitSignature?.v || 0,
      permitR: permitSignature?.r || '0x0000000000000000000000000000000000000000000000000000000000000000',
      permitS: permitSignature?.s || '0x0000000000000000000000000000000000000000000000000000000000000000',
    }

    const { data } = await submitMove2({ args: [move2Params] })
  }

  const renderSelection = () => {
    if (tokenId !== undefined) {
      return (
        <StyledBopper>
          <BotImage alt={`Arbit #${tokenId}`} src={`/images/bounce/${tokenId}.gif`}></BotImage>
        </StyledBopper>
      )
    } else {
      return <EmptyBot alt={'?'} src="/images/questionmark.png"></EmptyBot>
    }
  }

  const renderSection = () => {
    if (section === 0) {
      return (
        <>
          <OwnedBotSelector onBotSelected={setTokenId} />
          <Row>
            <Col xs={12} className="text-end">
              <Button
                size="lg"
                onClick={() => {
                  setSection(1)
                }}
                disabled={tokenId === undefined}
              >
                Next
              </Button>
            </Col>
          </Row>
        </>
      )
    } else if (section === 1) {
      return (
        <>
          <MoveSelector move={move} setMove={setMove}></MoveSelector>
          <Row>
            <Col xs={6}>
              <Button
                size="lg"
                onClick={() => {
                  setSection(0)
                }}
              >
                Prev
              </Button>
            </Col>
            <Col xs={6} className="text-end">
              <Button
                size="lg"
                onClick={() => {
                  setSection(2)
                }}
                disabled={move === undefined}
              >
                Next
              </Button>
            </Col>
          </Row>
        </>
      )
    } else if (section === 2) {
      return (
        <>
          <Row>
            <Col md={{ offset: 2, span: 8 }}>
              {round?.wager.gt(0) && (
                <>
                  <h4>This round has a wager of {formatUnits(round.wager, BOTGOLD_DECIMALS)} BotGold</h4>
                  <div className="d-grid mb-2">
                    <Button variant="primary" size="lg" onClick={handleSignPermit}>
                      {signatureLoading && (
                        <>
                          <Spinner animation="border" as="span" size="sm" role="status" aria-hidden="true" />{' '}
                        </>
                      )}
                      Confirm wager
                    </Button>
                  </div>
                </>
              )}
              <div className="d-grid">
                <Button variant="primary" size="lg" onClick={handleSubmitMove2} disabled={submitMoveDisabled()}>
                  {submitMove2Loading && (
                    <>
                      <Spinner animation="border" as="span" size="sm" role="status" aria-hidden="true" />{' '}
                    </>
                  )}
                  SUBMIT YOUR MOVE!!
                </Button>
              </div>
            </Col>
          </Row>
          <Row className="align-self-bottom">
            <Col xs={6}>
              <Button
                size="lg"
                onClick={() => {
                  setSection(1)
                }}
              >
                Prev
              </Button>
            </Col>
          </Row>
        </>
      )
    }
  }

  const renderRoundBody = () => {
    if (!round) {
      return <></>
    }

    return (
      <Row>
        <Col sm={12} lg={4} xl={3}>
          <Row>
            <Col xs={5}>
              <StyledBopper>
                <BotBopper tokenId={round.arbibotId1.toNumber()} />
              </StyledBopper>
            </Col>
            <Col xs={2} className="align-self-center">
              VS
            </Col>
            <Col xs={5}>{renderSelection()}</Col>
          </Row>
        </Col>
        <Col>{renderSection()}</Col>
      </Row>
    )
  }

  return (
    <Container>
      <Row>
        <Col>
          <CloudBox>
            <h1>Fight!!</h1>
            {renderRoundBody()}
          </CloudBox>
        </Col>
      </Row>
    </Container>
  )
}
