import { useContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import GlobalError from '../contexts/GlobalError'
import styled from 'styled-components'

const ErrorImage = styled.img`
  width: 75px;
  float: left;
  padding-right: 10px;
`
export const ErrorModal = () => {
  const { isDisplayed, content, hide } = useContext(GlobalError)

  return (
    <Modal show={isDisplayed} onHide={hide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Woops</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ErrorImage src="/images/errorbot.png" alt="error" />
        {content}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
