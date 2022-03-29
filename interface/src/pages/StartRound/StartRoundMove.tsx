import { useEffect, useState } from 'react'
import { useSignMessage } from 'wagmi'
import { BigNumber } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useAttestProof } from '../../hooks/useAttestProof'
import { generateSignatureString } from '../../util/generateSignatureString'
import { AttestValidMoveProof } from '../../util/proofs'
import { MoveSelector } from '../../components/MoveSelector'

export const StartRoundMove = ({
  arbibotId,
  nonce,
  onPrev,
  onNext,
  onProofGenerated,
}: {
  arbibotId?: string
  nonce: BigNumber | undefined
  onPrev: () => void
  onNext: () => void
  onProofGenerated?: (proof: AttestValidMoveProof) => void
}) => {
  const [move, setMove] = useState<string>()
  const [sigRequired, setSigRequired] = useState(true)

  const [proofData, proofError, , generateProof] = useAttestProof()

  const [{ data: signData, error: signError, loading: signLoading }, signMessage] = useSignMessage()

  useEffect(() => {
    setSigRequired(true)
    setMove(undefined)
  }, [arbibotId, nonce])

  useEffect(() => {
    if (proofData && onProofGenerated) {
      onProofGenerated(proofData)
    }
  }, [onProofGenerated, proofData])

  const handleProofGeneration = async (move: string) => {
    if (!nonce || !arbibotId) {
      return
    }

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
    <>
      <MoveSelector
        onMoveSelected={handleProofGeneration}
        disabled={!nonce}
        move={move}
        setMove={setMove}
      ></MoveSelector>
      <Row>
        <Col xs={6}>
          <Button size="lg" onClick={onPrev}>
            Prev
          </Button>
        </Col>
        <Col xs={6} className="text-end">
          <Button size="lg" onClick={onNext} disabled={signLoading || move === ''}>
            Next
          </Button>
        </Col>
      </Row>
    </>
  )
}
