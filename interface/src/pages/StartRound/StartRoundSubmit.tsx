import { useContext, useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, useNetwork, useSignTypedData } from 'wagmi'
import styled from 'styled-components'
import { BigNumber, Signature } from 'ethers/lib/ethers'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import FormControl from 'react-bootstrap/FormControl'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import { AttestValidMoveProof } from '../../util/proofs'
import { ArbibotRPS } from '../../abis/types'
import {
  ARBIBOT_RPS_ADDRESS,
  ARBIBOT_RPS_CONFIG,
  BOTGOLD_CONFIG,
  BOTGOLD_DECIMALS,
  BOTGOLD_EIP_2612_DOMAIN,
  EIP_2612_TYPES,
} from '../../util/constants'
import { formatUnits, parseUnits, splitSignature } from 'ethers/lib/utils'
import GlobalError from '../../contexts/GlobalError'
import { TransactionResponse } from '@ethersproject/providers'
import Spinner from 'react-bootstrap/Spinner'

const InfoButton = styled(Button)`
  padding: 0;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.75rem;
  vertical-align: baseline;
`

const HappyBotImage = styled.img`
  width: 75px;
  float: left;
  padding-right: 10px;
`
const DEFAULT_MAX_ROUND_TIME = 2 * 24 * 60 * 60

// const ROUND_TIMINGS = [
//   { maxRoundTime: 0, label: 'None' },
//   { maxRoundTime: 6 * 60 * 60, label: '6 Hours' },
//   { maxRoundTime: 24 * 60 * 60, label: '1 Day' },
//   { maxRoundTime: 2 * 24 * 60 * 60, label: '2 Days' },
// ]

export const StartRoundSubmit = ({
  arbibotId,
  nonce,
  proofData,
  onPrev,
  onRoundSubmitted,
}: {
  onPrev: () => void
  arbibotId?: string
  nonce?: BigNumber
  proofData?: AttestValidMoveProof
  onRoundSubmitted?: (tx: TransactionResponse) => void
}) => {
  const { show: showError } = useContext(GlobalError)
  const [balance, setBalance] = useState('')
  const [betAmount, setBetAmount] = useState('0')
  const [betAmountBN, setBetAmountBN] = useState(BigNumber.from(0))
  const [maxRoundTime, setMaxRoundTime] = useState(DEFAULT_MAX_ROUND_TIME)
  const [permitDeadline, setPermitDeadline] = useState(0)
  const [permitSignature, setPermitSignature] = useState<Signature>()
  const [showModal, setShowModal] = useState(false)
  const [modalText, setModalText] = useState('')
  const [{ data: accountData }] = useAccount()
  const [{ data: networkData }] = useNetwork()
  const [{ data: nonceData }] = useContractRead(BOTGOLD_CONFIG, 'nonces', {
    args: [accountData?.address],
  })
  const [{ data: balanceData }] = useContractRead(BOTGOLD_CONFIG, 'balanceOf', {
    args: [accountData?.address],
  })
  const [{ loading: startRoundLoading }, startRound] = useContractWrite(ARBIBOT_RPS_CONFIG, 'startRound')
  const [{ data: signatureData, loading: signatureLoading }, signTypedData] = useSignTypedData()

  useEffect(() => {
    try {
      setBetAmountBN(parseUnits(betAmount, BOTGOLD_DECIMALS))
    } catch (e) {
      setBetAmountBN(BigNumber.from(0))
    }
  }, [betAmount])

  useEffect(() => {
    if (balanceData) {
      const formattedBalance = formatUnits(balanceData, BOTGOLD_DECIMALS)
      setBalance(formattedBalance)
    }
  }, [balanceData])

  useEffect(() => {
    if (signatureData) {
      const signature = splitSignature(signatureData)
      setPermitSignature(signature)
    }
  }, [signatureData])

  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = (text: string) => {
    setModalText(text)
    setShowModal(true)
  }

  const handleSignPermit = () => {
    if (!accountData || !networkData.chain) {
      return
    }

    const deadline = Math.floor(Date.now() / 1000) + 60 * 5
    setPermitDeadline(deadline)

    const value = {
      owner: accountData.address,
      spender: ARBIBOT_RPS_ADDRESS,
      value: parseUnits(betAmount, BOTGOLD_DECIMALS),
      nonce: nonceData,
      deadline,
    }

    signTypedData({ domain: BOTGOLD_EIP_2612_DOMAIN, types: EIP_2612_TYPES, value })
  }

  const handleSetBetAmount = (_betAmount: string) => {
    setBetAmount(_betAmount)
    if (_betAmount !== '' && maxRoundTime === 0) {
      setMaxRoundTime(DEFAULT_MAX_ROUND_TIME)
    }
  }

  const handleStartRound = async () => {
    if (!permitSignature && !betAmountBN.eq(0)) {
      showError('You must confirm your bet (or empty it) before submitting')
      return
    }
    if (proofData && nonce && arbibotId) {
      const startParams: ArbibotRPS.StartParamsStruct = {
        proof: proofData.proof,
        arbibotId,
        moveAttestation: proofData.moveAttestation,
        nonce,
        maxRoundTime,
        permitAmount: betAmountBN,
        permitDeadline: permitDeadline,
        permitV: permitSignature?.v || 0,
        permitR: permitSignature?.r || '0x0000000000000000000000000000000000000000000000000000000000000000',
        permitS: permitSignature?.s || '0x0000000000000000000000000000000000000000000000000000000000000000',
      }

      const { data } = await startRound({ args: [startParams] })
      if (data && onRoundSubmitted) {
        onRoundSubmitted(data)
      }
    }
  }

  return (
    <>
      <Row>
        <Col md={{ offset: 2, span: 8 }}>
          <h4>
            <InfoButton
              variant="link"
              onClick={() =>
                handleShowModal('Any BotGold bet will require your opponent to match; winner takes all. Good luck, Bot')
              }
            >
              ⓘ
            </InfoButton>{' '}
            Care to put a wager behind that?
          </h4>
          <small className="text-muted">Your current BotGold balance is {balance}</small>
          <InputGroup className="mb-3" size="lg">
            <InputGroup.Text>$BG</InputGroup.Text>
            <FormControl
              aria-label="Amount"
              type="number"
              placeholder="0.00"
              value={betAmount}
              onChange={(e) => handleSetBetAmount(e.target.value)}
            />
            <Button variant="primary" disabled={betAmount === ''} onClick={handleSignPermit}>
              {signatureLoading && (
                <>
                  <Spinner animation="border" as="span" size="sm" role="status" aria-hidden="true" />{' '}
                </>
              )}
              Confirm
            </Button>
          </InputGroup>
          {!betAmountBN.eq(0) && (
            <p>
              <small>
                Once a second move has been played you have 48 hours to end the round. If you do not end the round
                within 48 hours player 2 can claim the reward and win by forfeit.
              </small>
            </p>
          )}
          <br />
          <div className="d-grid">
            <Button variant="primary" size="lg" onClick={handleStartRound}>
              {startRoundLoading && (
                <>
                  <Spinner animation="border" as="span" size="sm" role="status" aria-hidden="true" />{' '}
                </>
              )}
              START THE ROUND!!
            </Button>
          </div>
        </Col>
      </Row>
      <Button size="lg" onClick={onPrev}>
        Prev
      </Button>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HappyBotImage src="/images/happybot.png" alt="error" />
          <p>{modalText}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
