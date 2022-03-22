import { useState } from 'react'
import { useContractWrite } from 'wagmi'
import { BigNumber } from 'ethers/lib/ethers'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { AttestValidMoveProof } from '../../util/proofs'
import { ArbibotRPS } from '../../abis/types'
import { ARBIBOT_RPS_CONFIG } from '../../util/constants'

export const StartRoundSubmit = ({
  arbibotId,
  nonce,
  proofData,
  onRoundSubmitted,
}: {
  arbibotId?: string
  nonce?: BigNumber
  proofData?: AttestValidMoveProof
  onRoundSubmitted?: () => void
}) => {
  const [{ error: startRoundError, loading: startRoundLoading }, startRound] = useContractWrite(
    ARBIBOT_RPS_CONFIG,
    'startRound'
  )

  const handleStartRound = () => {
    if (proofData && nonce && arbibotId) {
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

  return (
    <>
      <Button onClick={() => {}}>SSSUUUUBBBBMMMIIIIITTTT</Button>
    </>
  )
}
