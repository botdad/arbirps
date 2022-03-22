import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useAccount, useNetwork, useConnect } from 'wagmi'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import BSNav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import styled from 'styled-components'

const HappyBotImage = styled.img`
  width: 75px;
  float: left;
  padding-right: 10px;
`

export const Nav = () => {
  const [{ data: accountData }, disconnect] = useAccount()
  const [{ data: networkData, error, loading }, switchNetwork] = useNetwork()
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [address, setAddress] = useState('')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)

  const handleCloseStatusModal = () => setShowStatusModal(false)
  const handleShowStatusModal = () => setShowStatusModal(true)

  const handleCloseConnectModal = () => setShowConnectModal(false)
  const handleShowConnectModal = () => setShowConnectModal(true)

  const buttonText = () => {
    if (accountData?.connector) {
      const len = address.length
      return address.substring(0, 6) + '…' + address.substring(len - 5, len - 1)
    }
    return 'Connect…'
  }

  useEffect(() => {
    handleCloseStatusModal()
    handleCloseConnectModal()
  }, [address])

  useEffect(() => {
    if (address !== accountData?.address) {
      setAddress(accountData?.address || '')
    }
  }, [accountData, address])

  const handleShowCorrectModal = () => {
    if (accountData?.connector) {
      handleShowStatusModal()
    } else {
      handleShowConnectModal()
    }
  }

  return (
    <>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src="/images/pixelatedlogo.png"
              width="126"
              height="30"
              className="d-inline-block align-top"
              alt="RPS"
            />
            <img src="/images/rps.png" width="56" height="30" className="d-inline-block align-top" alt="RPS" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <BSNav className="me-auto">
              <LinkContainer to="/start-round">
                <BSNav.Link>Start round</BSNav.Link>
              </LinkContainer>
              <BSNav.Link href="#link">Open rounds</BSNav.Link>
              <BSNav.Link href="#link">End round</BSNav.Link>
            </BSNav>
            <BSNav>
              <Button variant="outline-primary" onClick={handleShowCorrectModal}>
                {buttonText()}
              </Button>
            </BSNav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal show={showStatusModal} onHide={handleCloseStatusModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Connection Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HappyBotImage src="/images/happybot.png" alt="error" />
          <small>{accountData?.address}</small>
          <br />
          You're connected to {networkData.chain?.name} via {accountData?.connector?.name}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={disconnect}>
            Disconnect
          </Button>
          <Button variant="secondary" onClick={handleCloseStatusModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showConnectModal} onHide={handleCloseConnectModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Connect</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HappyBotImage src="/images/happybot.png" alt="error" />
          Connect via:
          <br />
          {connectData.connectors.map((connector) => (
            <React.Fragment key={connector.id}>
              <Button disabled={!connector.ready} key={connector.id} size="sm" onClick={() => connect(connector)}>
                {connector.name}
                {!connector.ready && ' (unsupported)'}
              </Button>{' '}
            </React.Fragment>
          ))}
          {connectError && <div>{connectError?.message ?? 'Failed to connect'}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConnectModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
